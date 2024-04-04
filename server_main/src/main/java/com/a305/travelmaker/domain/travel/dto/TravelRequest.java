package com.a305.travelmaker.domain.travel.dto;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@ToString
public class TravelRequest {

  private LocalDate startDate;
  private LocalDate endDate;
  private Transportation transportation;
  private List<Integer> destinationIdList;

  public long calculateTravelDays() {
    long travelDays = ChronoUnit.DAYS.between(startDate, endDate);
    return travelDays + 1;
  }

}
