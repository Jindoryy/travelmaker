package com.a305.travelmaker.domain.login.dto;

import com.a305.travelmaker.domain.user.dto.UserStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OauthTokenRes {

    private Long userId;
    private String nickName;
    private String profileUrl;
    private int tag;
    private UserStatus status;
    private String tokenType;
    private String accessToken;
    private Integer expiresIn;
    private String refreshToken;
    private Integer refreshTokenExpiresIn;
}
