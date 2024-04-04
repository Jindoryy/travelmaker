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
public class DestinationCfListResponse {

  private Map<String, List<DestinationListResponse>> destinationListResponseMap;
}
