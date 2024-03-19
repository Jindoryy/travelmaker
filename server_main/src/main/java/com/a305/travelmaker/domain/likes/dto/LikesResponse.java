package com.a305.travelmaker.domain.likes.dto;

import com.a305.travelmaker.domain.destination.entity.Destination;
import com.a305.travelmaker.domain.user.entity.User;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class LikesResponse {

    private User userId;
    private Destination destinationId;
    private Boolean flag;

    @Builder
    public LikesResponse(User userId,Destination destinationId, Boolean flag) {
        this.userId = userId;
        this.destinationId = destinationId;
        this.flag = flag;
    }

}
