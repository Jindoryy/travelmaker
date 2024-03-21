package com.a305.travelmaker.domain.likes.dto;

import com.a305.travelmaker.domain.destination.entity.Destination;
import com.a305.travelmaker.domain.user.entity.User;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class LikesResponse {

    private Long userId;
    private Integer destinationId;

    @Builder
    public LikesResponse(Long userId,Integer destinationId) {
        this.userId = userId;
        this.destinationId = destinationId;
    }
}
