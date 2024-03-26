package com.a305.travelmaker.domain.destination.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DestinationRecommend {

  private Long userId;
  private Integer cityId;
}
