package com.a305.travelmaker.domain.user.controller;

import com.a305.travelmaker.domain.login.dto.UserDetail;
import com.a305.travelmaker.domain.user.dto.UserExtraInfoDto;
import com.a305.travelmaker.domain.user.dto.UserFriendResponse;
import com.a305.travelmaker.domain.user.dto.UserStatusResponse;
import com.a305.travelmaker.domain.user.dto.UserTravelPlanDto;
import com.a305.travelmaker.domain.user.service.UserService;
import com.a305.travelmaker.global.common.dto.SuccessResponse;
import com.a305.travelmaker.global.common.exception.CustomException;
import com.a305.travelmaker.global.common.exception.ErrorCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@Tag(name = "User", description = "유저 API")
public class UserController {

    private final UserService userService;

    @Operation(summary = "유저 상태 조회 개발용 임시(토큰 불 필요)", description = "유저 여행 상태, 성별-생년월일 입력 여부 반환")
    @PostMapping("/status")
    public SuccessResponse<UserStatusResponse> getUserStatusTmp(@RequestBody Long userId) {
        return new SuccessResponse<>(userService.getUserStatus(userId));
    }

    @Operation(summary = "유저 상태 조회", description = "유저 여행 상태, 성별-생년월일 입력 여부 반환")
    @GetMapping("/status")
    public SuccessResponse<UserStatusResponse> getUserStatus(
        @AuthenticationPrincipal UserDetail userDetail) {
        if (userDetail == null) {
            throw new CustomException(ErrorCode.NO_AUTHENTICATED_USER_FOUND);
        }
        Long userId = userDetail.getId();
        return new SuccessResponse<>(userService.getUserStatus(userId));
    }

    @Operation(summary = "유저 성별 및 생년월일 업데이트", description = "유저의 성별과 생년월일 정보를 업데이트합니다.")
    @PatchMapping("/update-extra-info")
    public SuccessResponse<Void> updateGenderAndBirth(
        @AuthenticationPrincipal UserDetail userDetail,
        @RequestBody UserExtraInfoDto userInfo) {

        if (userDetail == null) {
            throw new CustomException(ErrorCode.NO_AUTHENTICATED_USER_FOUND);
        }
        if (userDetail.getId() != userInfo.getUserId()) {
            throw new CustomException(ErrorCode.FORBIDDEN_ERROR);
        }
        userService.updateGenderAndBirth(userInfo);
        return new SuccessResponse<>(null);
    }

    @Operation(summary = "친구 검색", description = "닉네임 또는 태그를 이용하여 친구를 검색합니다.")
    @GetMapping("/search")
    public SuccessResponse<List<UserFriendResponse>> searchUsers(@RequestParam String condition) {
        return new SuccessResponse<>(userService.searchUsers(condition));
    }


    @GetMapping("/afterToday")
    public List<UserTravelPlanDto> getTravelAfterToday(@RequestParam Long userId) {
        return userService.findUserTravelPlan(userId);


    }
}