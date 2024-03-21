package com.a305.travelmaker.domain.destination.dto;

import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DestinationRecommendResponse {

  private Map<String, List<Integer>> DestinationRecommendList;
}
