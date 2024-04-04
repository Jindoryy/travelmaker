package com.a305.travelmaker.domain.likes.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@ToString
public class LikesRequest {
    private Long userId;
    private Integer destinationId;
}
