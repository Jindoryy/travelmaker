// UserService.java

package com.a305.travelmaker.domain.user.service;

import com.a305.travelmaker.domain.travel.service.TravelService;
import com.a305.travelmaker.domain.user.dto.UserStatus;
import com.a305.travelmaker.domain.user.dto.UserStatusResponse;
import com.a305.travelmaker.domain.user.entity.User;
import com.a305.travelmaker.domain.user.repository.UserRepository;
import com.a305.travelmaker.global.common.exception.CustomException;
import com.a305.travelmaker.global.common.exception.ErrorCode;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final TravelService travelService;


    public UserStatusResponse getUserStatus(Long userId) {

        // userId로 유저 조회, 미등록 유저시 404 반환
        User user = userRepository.findById(userId).orElseThrow(() -> new CustomException(
            ErrorCode.USER_NOT_FOUND_ERROR));

        // 생년월일 성별 입력 여부 확인
        boolean birthCheck = user.getBirth() != null;
        boolean genderCheck = user.getGender() != null;
        // 유저 조회가 성공했으모로 diaryCheck에서는 유저 유효성 검증 안합니다.
        boolean diaryCheck = travelService.checkUserDiaryStatus(userId);

        // 유저 상태 반환 DTO 빌드
        UserStatusResponse response = UserStatusResponse.builder()
            .status(user.getStatus().toString())
            .birthCheck(birthCheck)
            .genderCheck(genderCheck)
            .diaryCheck(diaryCheck)
            .build();
        
        return response;
    }
    public void updateUserStatusAfterCourse(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new CustomException(
            ErrorCode.USER_NOT_FOUND_ERROR));
        user.setStatus(UserStatus.AFTER_COURSE);
        userRepository.save(user);
    }

    public void updateUserStatusOnCourse(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new CustomException(
            ErrorCode.USER_NOT_FOUND_ERROR));
        user.setStatus(UserStatus.ON_COURSE);
        userRepository.save(user);
    }
}
