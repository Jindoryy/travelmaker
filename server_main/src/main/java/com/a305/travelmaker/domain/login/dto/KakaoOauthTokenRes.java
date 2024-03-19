package com.a305.travelmaker.domain.login.dto;

import lombok.Getter;

@Getter
public class KakaoOauthTokenRes {

    private String token_type;

    private String access_token;

    private Integer expires_in;

    private String refresh_token;

    private Integer refresh_token_expires_in;

    private String id_token; // 카카오dev에서 OPEN ID Connect 활성화를 하면 추가 지급되는 컬럼
}
