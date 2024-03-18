package com.example.demo.service;

import com.example.demo.data.PlaceDTO;
import com.example.demo.entity.Place;
import com.example.demo.repository.PlaceRepository;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Map;
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
    private final String numOfRows = "&numOfRows=1000";
    private final String areaCode = "&areaCode=32";
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
                String cat1 = String.valueOf(item.get("cat1")); // cat1 값 추출
                return !(cat1.equals("B02") || cat1.equals("C01"));
            })
            .map(item -> {
                String cat1 = String.valueOf(item.get("cat1")); // cat1 값 추출
                String type = ""; // type 변수 추가
                if (cat1.equals("A05")) {
                    type = "food";
                } else {
                    type = "sights";
                }

                PlaceDTO placeDTO = new PlaceDTO(
                    String.valueOf(item.get("contentid")),
                    String.valueOf(item.get("contenttypeid")),
                    String.valueOf(item.get("sigungucode")),
                    String.valueOf(item.get("title")),
                    String.valueOf(item.get("mapx")),
                    String.valueOf(item.get("mapy")),
                    String.valueOf(item.get("firstimage"))
                );
                return new Place(
                    placeDTO.getContentid(),
                    placeDTO.getContenttypeid(),
                    placeDTO.getSigungucode(),
                    placeDTO.getTitle(),
                    placeDTO.getMapx(),
                    placeDTO.getMapy(),
                    placeDTO.getFirstimage(),
                    type // cat1을 type으로 변경
                );
            })
            .toList();

        placeRepository.saveAll(places);

        return places;
    }
}
