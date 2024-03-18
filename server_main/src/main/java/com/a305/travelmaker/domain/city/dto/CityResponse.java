package com.a305.travelmaker.domain.city.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CityResponse {

  private Integer cityId;
  private String cityName;
  private String cityUrl;

  @Builder
  public CityResponse(Integer cityId, String cityName, String cityUrl) {
    this.cityId = cityId;
    this.cityName = cityName;
    this.cityUrl = cityUrl;
  }
}
