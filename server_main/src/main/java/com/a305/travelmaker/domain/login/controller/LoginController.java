package com.a305.travelmaker.domain.login.controller;

import com.a305.travelmaker.domain.login.data.CodeDTO;
import com.a305.travelmaker.domain.login.data.KakaoOauthTokenRes;
import com.a305.travelmaker.domain.login.data.KakaoUserInfoRes;
import com.a305.travelmaker.domain.login.data.OauthTokenRes;
import com.a305.travelmaker.domain.login.service.LoginService;
import com.a305.travelmaker.global.common.jwt.TokenProvider;
import com.a305.travelmaker.global.common.response.SuccessResponse;
import lombok.RequiredArgsConstructor;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/login")
public class LoginController {

    private final LoginService loginService;
    private final TokenProvider tokenProvider;

    @PostMapping("/oauth2/code/kakao")
    public SuccessResponse<String> getAccessToken(@RequestBody CodeDTO codeDTO) {
        String code = codeDTO.getCode();
        System.out.println(code);
        KakaoOauthTokenRes oauthTokenData = loginService.getTokenValidation(code);
        // 받은 토큰 정보를 콘솔에 출력
        System.out.println("AccessToken: " + oauthTokenData.getAccess_token());
        System.out.println("TokenType: " + oauthTokenData.getToken_type());
        System.out.println("RefreshToken: " + oauthTokenData.getRefresh_token());
        System.out.println("ExpiresIn: " + oauthTokenData.getExpires_in());
        System.out.println("Scope: " + oauthTokenData.getRefresh_token_expires_in());
        KakaoUserInfoRes kakaoUserInfoRes = loginService.getUserInfo(oauthTokenData.getAccess_token());
        System.out.println("email: " + kakaoUserInfoRes.getKakao_account().getEmail());
        System.out.println("nickname: " + kakaoUserInfoRes.getKakao_account().getProfile().getNickname());
        System.out.println("profile_image_url: " + kakaoUserInfoRes.getKakao_account().getProfile().getProfile_image_url());
        return new SuccessResponse<>(code);
    }

}
