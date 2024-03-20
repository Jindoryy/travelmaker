package com.a305.travelmaker.domain.login.controller;

import com.a305.travelmaker.domain.login.data.CodeDTO;
import com.a305.travelmaker.domain.login.data.KakaoOauthTokenRes;
import com.a305.travelmaker.domain.login.data.KakaoUserInfoRes;
import com.a305.travelmaker.domain.login.data.OauthTokenRes;
import com.a305.travelmaker.domain.login.repository.RefreshTokenRepository;
import com.a305.travelmaker.domain.login.service.LoginService;
import com.a305.travelmaker.domain.user.domain.User;
import com.a305.travelmaker.global.common.jwt.TokenProvider;
import com.a305.travelmaker.global.common.dto.SuccessResponse;
import lombok.RequiredArgsConstructor;
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
    private final RefreshTokenRepository refreshTokenRepository;

    @PostMapping("/oauth2/code/kakao")
    public SuccessResponse<OauthTokenRes> getAccessToken(@RequestBody CodeDTO codeDTO) {
        String code = codeDTO.getCode();
        KakaoOauthTokenRes oauthTokenData = loginService.getTokenValidation(code);
        KakaoUserInfoRes kakaoUserInfoRes = loginService.getUserInfo(
            oauthTokenData.getAccess_token());
        User user = loginService.accountCheck(kakaoUserInfoRes);
        OauthTokenRes oauthTokenRes = tokenProvider.generateTokenDto(user);
        loginService.SaveRefreshToken(user, oauthTokenRes.getRefreshToken(),
            oauthTokenRes.getRefreshTokenExpiresIn() / 1000);
        return new SuccessResponse<>(oauthTokenRes);
    }

}
