package com.a305.travelmaker.domain.login.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserDetail {

    private Long id;
    private String nickname;
    private String profileUrl;
}
