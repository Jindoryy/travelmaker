package com.a305.travelmaker.global.common.dto;

import com.a305.travelmaker.domain.destination.dto.DestinationType;
import com.a305.travelmaker.domain.travel.dto.Point;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class DestinationDistanceResponse {

  private Point point;
  @Setter
  private double nextDestinationDistance;
  private String destinationName;
  private DestinationType destinationType;
  private String destinationImgUrl;
}
