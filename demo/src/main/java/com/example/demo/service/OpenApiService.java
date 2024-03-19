package com.example.demo.service;

import com.example.demo.data.PlaceDTO;
import com.example.demo.entity.Place;
import com.example.demo.repository.PlaceRepository;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class OpenApiService {
    private final String BASE_URL = "http://api.visitkorea.or.kr/openapi/service/rest/KorService";
    private final String apiUri = "/areaBasedList";
    private final String serviceKey = "?ServiceKey=FUOnFNLElwv776kHyNZiRWTRUj4wJ41OVvpCh/6oYiqFR95xn9Kq9x9XRHJls0kas8cpLmaRhKduBnbHgbeUnQ==";
    private final String defaultQueryParam = "&MobileOS=ETC&MobileApp=AppTest&_type=json";
    private final String numOfRows = "&numOfRows=1000000000";
    private final String areaCode = "";
    private final String contentTypeId = "";

    private final RestTemplate restTemplate;
    private final PlaceRepository placeRepository;

    @Autowired
    public OpenApiService(RestTemplate restTemplate, PlaceRepository placeRepository) {
        this.restTemplate = restTemplate;
        this.placeRepository = placeRepository;
    }

    private String makeUrl() throws UnsupportedEncodingException {
        return BASE_URL +
            apiUri +
            serviceKey +
            defaultQueryParam +
            numOfRows +
            areaCode +
            contentTypeId;
    }

    public List<Place> fetchAndSave() throws UnsupportedEncodingException {
        ResponseEntity<Map> responseEntity = restTemplate.exchange(makeUrl(), HttpMethod.GET, new HttpEntity<>(new HttpHeaders()), Map.class);
        Map<String, Object> responseBody = responseEntity.getBody();
        Map<String, Object> response = (Map<String, Object>) responseBody.get("response");
        Map<String, Object> body = (Map<String, Object>) response.get("body");
        Map<String, Object> items = (Map<String, Object>) body.get("items");
        List<Map<String, Object>> itemList = (List<Map<String, Object>>) items.get("item");

        List<Place> places = itemList.stream()
            .filter(item -> {
                String cat1 = String.valueOf(item.get("cat1"));
                return !(cat1.equals("B02") || cat1.equals("C01"));
            })
            .map(item -> {
                String cat1 = String.valueOf(item.get("cat1"));
                String cat2 = String.valueOf(item.get("cat2"));
                String cat3 = String.valueOf(item.get("cat3"));
                String type = "";
                if (cat1.equals("A05")) {
                    type = "food";
                } else {
                    type = "sights";
                }
                if(cat3.equals("A05020900")){
                    type = "cafe";
                }

                String firstimage = String.valueOf(item.get("firstimage"));
                String areacode = String.valueOf(item.get("areacode")); // 추가된 부분
                String mapx = String.valueOf(item.get("mapx"));
                String mapy = String.valueOf(item.get("mapy"));


                if (firstimage.isEmpty()) {
                    return null;
                }

                if (mapx.equals("0") || mapy.equals("0")) {
                    return null;
                }



                PlaceDTO placeDTO = new PlaceDTO(
                    String.valueOf(item.get("contentid")),
                    String.valueOf(item.get("contenttypeid")),
                    String.valueOf(item.get("sigungucode")),
                    String.valueOf(item.get("title")),
                    String.valueOf(item.get("mapx")),
                    String.valueOf(item.get("mapy")),
                    firstimage,
                    areacode // 수정된 부분: areacode 값으로 수정
                );
                return new Place(
                    placeDTO.getContentid(),
                    placeDTO.getContenttypeid(),
                    placeDTO.getSigungucode(),
                    placeDTO.getTitle(),
                    placeDTO.getMapx(),
                    placeDTO.getMapy(),
                    placeDTO.getFirstimage(),
                    type,
                    cat1,
                    cat2,
                    cat3,
                    areacode,
                    null
                );
            })
            .filter(Objects::nonNull)
            .toList();

        placeRepository.saveAll(places);

        return places;
    }
}