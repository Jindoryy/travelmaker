package com.a305.travelmaker.domain.diary.dto;

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
public class DiaryDetailResponse {

  private String name;
  private LocalDate startDate;
  private LocalDate endDate;
  private String text;
  private List<String> imgUrls;
}
