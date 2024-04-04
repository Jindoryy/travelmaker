package com.a305.travelmaker.domain.city.service;

import com.a305.travelmaker.domain.city.dto.CityResponse;
import com.a305.travelmaker.domain.city.entity.City;
import com.a305.travelmaker.domain.city.repository.CityRepository;
import com.a305.travelmaker.global.util.FileUtil;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class CityService {

  private final CityRepository cityRepository;
  private final FileUtil fileService;

  // 시 리스트 조회
  public List<CityResponse> findCityList(Integer id) {

    List<CityResponse> cityResponses = new ArrayList<>();
    List<City> cities = cityRepository.findCitiesByProvinceIdOrderByLikes(id);

    for (City city : cities) {
      CityResponse response = CityResponse.builder()
          .cityId(city.getId())
          .cityName(city.getName())
          .cityUrl(city.getImgUrl())
          .build();
      cityResponses.add(response);
    }

    return cityResponses;
  }

  // 시 데이터 저장 (테스트 용)
  public void saveCity(MultipartFile file, String name) {

    String imgUrl = fileService.uploadFile(file);

    cityRepository.save(City.builder()
        .name(name)
        .imgUrl(imgUrl)
        .build());
  }
}
