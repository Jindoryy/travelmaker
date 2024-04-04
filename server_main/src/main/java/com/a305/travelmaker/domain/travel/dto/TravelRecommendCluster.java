package com.a305.travelmaker.domain.travel.dto;

import java.util.List;
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
public class TravelRecommendCluster {

  private double centerLatitude;
  private double centerLongitude;
  private double r;
  private List<Integer> placeIds;
  private Long userId;
}