package com.a305.travelmaker.domain.travel.dto;

import java.util.List;
import java.util.Map;
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
public class TravelRecommend {

  Map<String, TravelRecommendCluster> travelRecommendCluster;
}
