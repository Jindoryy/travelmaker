package com.a305.travelmaker.domain.diary.dto;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiaryListResponse {

  private Integer diaryId;
  private String name;
  private LocalDate startDate;
  private LocalDate endDate;
  private String imgUrls;
}
