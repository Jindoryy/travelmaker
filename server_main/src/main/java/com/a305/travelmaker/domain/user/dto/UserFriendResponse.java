package com.a305.travelmaker.domain.user.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserFriendResponse {

    private Long userId;
    private String profileUrl;
    private String nickname;
    private int tag;
}
