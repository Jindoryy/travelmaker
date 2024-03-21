package com.a305.travelmaker.domain.login.controller;

import com.a305.travelmaker.domain.login.dto.CodeDTO;
import com.a305.travelmaker.domain.login.dto.KakaoOauthTokenRes;
import com.a305.travelmaker.domain.login.dto.KakaoUserInfoRes;
import com.a305.travelmaker.domain.login.dto.OauthTokenRes;
import com.a305.travelmaker.domain.login.entity.RefreshToken;
import com.a305.travelmaker.domain.login.repository.RefreshTokenRepository;
import com.a305.travelmaker.domain.login.service.LoginService;
import com.a305.travelmaker.domain.user.entity.User;
import com.a305.travelmaker.global.common.dto.SuccessResponse;
import com.a305.travelmaker.global.common.exception.CustomException;
import com.a305.travelmaker.global.common.exception.ErrorCode;
import com.a305.travelmaker.global.common.jwt.TokenProvider;
import java.time.LocalDateTime;
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

    @PostMapping("/oauth/token")
    public SuccessResponse<OauthTokenRes> tokenrReissuance(@RequestBody String refreshToken) {
        RefreshToken oldRefreshToken = refreshTokenRepository.findByToken(refreshToken)
            .orElseThrow(() -> new CustomException(ErrorCode.REFRESH_TOKEN_VALIDATION_ERROR));

        if(!oldRefreshToken.isValid(LocalDateTime.now())) {
            throw new CustomException(ErrorCode.REFRESH_TOKEN_VALIDATION_ERROR);
        }

        User user = loginService.getUserInfoByRefreshToken(refreshToken);

        return new SuccessResponse<>(loginService.replaceToken(user, oldRefreshToken));
    }
}
