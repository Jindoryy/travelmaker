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
public class TravelInfoRequest {

  private String cityName;
  private LocalDate startDate;
  private LocalDate endDate;
  private List<Integer> friendIdList;
  private Transportation transportation;
  private List<List<Integer>> courseList;

  public long calculateTravelDays() {
    long travelDays = ChronoUnit.DAYS.between(startDate, endDate);
    return travelDays + 1;
  }

}
