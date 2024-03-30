// UserService.java

package com.a305.travelmaker.domain.user.service;

import com.a305.travelmaker.domain.travel.service.TravelService;
import com.a305.travelmaker.domain.user.dto.UserExtraInfoDto;
import com.a305.travelmaker.domain.user.dto.UserFriendResponse;
import com.a305.travelmaker.domain.user.dto.UserStatus;
import com.a305.travelmaker.domain.user.dto.UserStatusResponse;
import com.a305.travelmaker.domain.user.entity.User;
import com.a305.travelmaker.domain.user.repository.UserRepository;
import com.a305.travelmaker.global.common.exception.CustomException;
import com.a305.travelmaker.global.common.exception.ErrorCode;
import java.util.List;
import java.util.Random;
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
        user.updateStatus(UserStatus.AFTER_COURSE);
        userRepository.save(user);
    }

    public void updateUserStatusOnCourse(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new CustomException(
            ErrorCode.USER_NOT_FOUND_ERROR));
        user.updateStatus(UserStatus.ON_COURSE);
        userRepository.save(user);
    }

    public void updateGenderAndBirth(UserExtraInfoDto userInfo) {
        // 성별과 생년월일 중 누락된 정보가 있으면 에러
        if (userInfo.getGender() == null || userInfo.getBirth() == null) {
            throw new CustomException(ErrorCode.MISSING_USER_INFO);
        }
        User user = userRepository.findById(userInfo.getUserId()).orElseThrow(() -> new CustomException(
            ErrorCode.USER_NOT_FOUND_ERROR));
        // 기존에 이미 존재하는 성별과 생년월일이라면 에러
        // 정보 추가가 아닌 수정은 다른 메소드에서 수행
        if (user.getGender() != null || user.getBirth() != null) {
            throw new CustomException(ErrorCode.INFO_ALREADY_EXISTS);
        }
        user.updateGenderAndBirth(userInfo.getGender(), userInfo.getBirth());
        userRepository.save(user);
    }

    public List<UserFriendResponse> searchUsers(String searchCondition) {
        List<User> users;
        // String의 시작이 #이면 태그 검색
        if (searchCondition.startsWith("#")) {
            // 태그 검색
            int tag = Integer.parseInt(searchCondition.substring(1));
            users = userRepository.findByTag(tag);
        } else {
            // 닉네임 검색
            users = userRepository.findByNicknameContaining(searchCondition);
        }
        // 검색 결과가 없으면 에러처리
        if (users.isEmpty()) throw new CustomException(ErrorCode.USER_NOT_FOUND_ERROR);

        return users.stream()
            .map(user -> UserFriendResponse.builder()
                .userId(user.getId())
                .profileUrl(user.getProfileUrl())
                .nickname(user.getNickname())
                .tag(user.getTag())
                .build())
            .toList();
    }

    // 유저 태그 랜덤으로 생성하는 기능
    public int generateUniqueUserTag() {
        Random rand = new Random();
        int attemptLimit = 10; // 무한 루프 방지를 위한 시도 횟수 제한
        for (int attempt = 0; attempt < attemptLimit; attempt++) {
            int randomNumber =
                10000000 + rand.nextInt(90000000); // 10000000(8자리)부터 99999999(8자리) 사이의 숫자 생성
            if (!userRepository.existsByTag(randomNumber)) {
                return randomNumber;
            }
        }
        throw new CustomException(ErrorCode.SERVICE_ERROR);
    }
}
