package com.a305.travelmaker.domain.travel.dto;

import com.a305.travelmaker.global.common.dto.DestinationDistanceResponse;
import java.time.LocalDate;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TravelInfoResponse {

  private String cityName;
  private LocalDate startDate;
  private LocalDate endDate;
  private Transportation transportation;
  private List<List<DestinationDistanceResponse>> travelList;
  ;
}