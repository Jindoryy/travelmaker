package com.a305.travelmaker.domain.destination.dto;

import com.a305.travelmaker.domain.travel.dto.Point;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DestinationDetailResponse {

  private Integer destinationId;
  private DestinationType destinationType;
  private String destinationName;
  private String destinationImgUrl;
  private Point point;
}
