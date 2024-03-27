package com.a305.travelmaker.domain.diary.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class DiaryUpdateRequest {

  private Integer diaryId;
  private String text;
}
