package com.a305.travelmaker.domain.travel.dto;

import com.a305.travelmaker.global.common.dto.DestinationDistanceResponse;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TravelResponse {

  private Map<Integer, List<DestinationDistanceResponse>> travelList;
}
