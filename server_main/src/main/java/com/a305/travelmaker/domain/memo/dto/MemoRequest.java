package com.a305.travelmaker.domain.memo.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class MemoRequest {
  private Integer travelId;
  private String memo;

}
