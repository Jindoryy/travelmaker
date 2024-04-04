package com.a305.travelmaker.domain.travel.dto;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AfterCourseResponse {

  private LocalDate startDate;
  private Integer travelId;
  private String cityName;
  private String imgUrl;
}
