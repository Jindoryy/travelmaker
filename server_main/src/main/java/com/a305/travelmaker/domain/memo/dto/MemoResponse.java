package com.a305.travelmaker.domain.memo.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class MemoResponse {
  private Integer id;
  private Integer travelId;
  private String memo;

}
