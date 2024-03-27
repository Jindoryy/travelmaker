package com.a305.travelmaker.domain.travel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TravelBeforeResponse {

  private Integer travelId;
  private String cityName;
  private String imgUrl;
  private Integer memoId;
}
