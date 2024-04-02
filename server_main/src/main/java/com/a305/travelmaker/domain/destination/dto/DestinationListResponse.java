package com.a305.travelmaker.domain.destination.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DestinationListResponse {

  private Integer destinationId;
  private DestinationType destinationType;
  private String destinationContent;
  private String destinationName;
  private String destinationImgUrl;
  private boolean likes_flag;
}
