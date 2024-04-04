package com.a305.travelmaker.domain.travel.dto;

import jakarta.persistence.Column;
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
public class TravelListResponse {

  private Integer travelId;
  private String cityName;
  private LocalDate startDate;
  private LocalDate endDate;
  private List<String> friendNameList;
  private String imgUrl;
  private DiaryStatus status;
  private Integer diaryId;
}
