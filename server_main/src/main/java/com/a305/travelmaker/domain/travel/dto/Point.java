package com.a305.travelmaker.domain.travel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class Point {

  private Integer destinationId;
  private double latitude;
  private double longitude;
}
