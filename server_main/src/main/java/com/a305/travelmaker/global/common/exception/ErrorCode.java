package com.a305.travelmaker.global.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    UNAUTHORIZED_USER_ERROR(401, "인증되지 않은 사용자입니다."),

    ACCESS_TOKEN_EXPIRE_ERROR(401, "Access Token의 기간이 만료되었습니다."),

    ACCESS_TOKEN_ERROR(401, "Access Token이 잘못되었습니다."),

    REFRESH_TOKEN_VALIDATION_ERROR(401, "Refresh Token이 잘못되었습니다."),

    USER_NOT_FOUND_ERROR(404, "존재하지 않는 사용자입니다."),

    NO_AUTHENTICATED_USER_FOUND(404, "인증되지 않은 사용자입니다."),

    KAKAO_AUTHORIZATION_CODE_ERROR(403, "잘못된 code입니다."),

    FORBIDDEN_ERROR(403, "접근 권한이 없습니다."),

    ART_NOT_FOUND_ERROR(404, "존재하지 않는 장소입니다."),

    FILE_UPLOAD_ERROR(404, "파일 업로드 에러"),

    INVALID_LIKE_REQUEST_ERROR(409, "현재 좋아요 상태가 변경하려는 상태와 동일합니다."),

    MISSING_USER_INFO(400, "누락된 정보가 있습니다."),

    INFO_ALREADY_EXISTS(409, "이미 존재하는 정보입니다."),

    SERVICE_ERROR(500, "로그인 장애! 고객센터로 문의 주세요!");

    private final int status;

    private final String message;
}
