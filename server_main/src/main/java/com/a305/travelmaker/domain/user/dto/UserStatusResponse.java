package com.a305.travelmaker.domain.user.dto;

import com.a305.travelmaker.domain.travel.dto.AfterCourseResponse;
import com.a305.travelmaker.domain.travel.dto.OnCourseResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class UserStatusResponse {

    private String status;
    private AfterCourseResponse afterCourseResponse;
    private OnCourseResponse onCourseResponse;
    private Boolean birthCheck;// 생년월일 미 입력시(null일시) false
    private Boolean genderCheck;// 성별 미 입력시(null일시) false
    private Boolean diaryCheck;// 작성해야 할 여행 일기가 있으면 true 없으면 false
}

