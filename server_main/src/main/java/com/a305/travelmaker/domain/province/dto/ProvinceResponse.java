package com.a305.travelmaker.domain.province.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProvinceResponse {

  private Integer provinceId;
  private String provinceName;
  private String provinceUrl;

  @Builder
  public ProvinceResponse(Integer provinceId, String provinceName, String provinceUrl) {
    this.provinceId = provinceId;
    this.provinceName = provinceName;
    this.provinceUrl = provinceUrl;
  }
}
