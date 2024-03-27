package com.a305.travelmaker.domain.destination.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DestinationRecommend {

  private List<Long> userId;
  private Integer cityId;
}
