package com.a305.travelmaker.domain.login.service;

import com.a305.travelmaker.domain.login.data.KakaoOauthTokenRes;
import com.a305.travelmaker.domain.login.data.KakaoUserInfoRes;
import com.a305.travelmaker.global.common.jwt.TokenProvider;
import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class LoginService {

    private final TokenProvider tokenProvider;

    private final RestTemplate restTemplate;

    private final String GRANT_TYPE = "authorization_code";

    @Value("${oauth2.provider.kakao.client-rest-key}")
    private String CLIENT_ID;
    @Value("${oauth2.provider.kakao.client-secret}")
    private String CLIENT_SECRET;

    private final String REDIRECT_URI = "http://localhost:3000/login/oauth2/code/kakao";

    private final String TOKEN_URL = "https://kauth.kakao.com/oauth/token";

    public KakaoOauthTokenRes getTokenValidation(String code) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", GRANT_TYPE);
        params.add("client_id", CLIENT_ID);
        params.add("redirect_uri", REDIRECT_URI);
//        params.add("client_secret", CLIENT_SECRET);
        params.add("code", code);

        HttpEntity<MultiValueMap<String, String>> kakaoTokenRequest = new HttpEntity<>(params, headers);

        ResponseEntity<String> response = restTemplate.exchange(
            TOKEN_URL, // https://{요청할 서버 주소}
            HttpMethod.POST, // 요청할 방식
            kakaoTokenRequest, // 요청할 때 보낼 데이터
            String.class // 요청 시 반환되는 데이터 타입
        );

        System.out.println(response.getBody());

        Gson gson = new Gson();

        return gson.fromJson(response.getBody(), KakaoOauthTokenRes.class);
    }

    public KakaoUserInfoRes getUserInfo(String token) {

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + token);
        headers.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

        HttpEntity<MultiValueMap<String, String>> req = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(
            "https://kapi.kakao.com/v2/user/me",
            HttpMethod.POST,
            req,
            String.class
        );

        Gson gson = new Gson();

        return gson.fromJson(response.getBody(), KakaoUserInfoRes.class);
    }

}
