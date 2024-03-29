package com.a305.travelmaker.domain.diary.controller;

import com.a305.travelmaker.domain.diary.dto.DiaryAddRequest;
import com.a305.travelmaker.domain.diary.dto.DiaryDetailResponse;
import com.a305.travelmaker.domain.diary.dto.DiaryListResponse;
import com.a305.travelmaker.domain.diary.dto.DiaryUpdateRequest;
import com.a305.travelmaker.domain.diary.service.DiaryService;
import com.a305.travelmaker.domain.login.dto.UserDetail;
import com.a305.travelmaker.global.common.dto.SuccessResponse;
import com.a305.travelmaker.global.common.exception.CustomException;
import com.a305.travelmaker.global.common.exception.ErrorCode;
import com.a305.travelmaker.global.common.jwt.TokenProvider;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/diary")
@Tag(name = "Diary", description = "일기 API")
public class DiaryController {

  private final TokenProvider tokenProvider;
  private final DiaryService diaryService;

  @Operation(summary = "일기 조회", description = "일기를 조회한다.")
  @GetMapping("/{id}")
  public SuccessResponse<DiaryDetailResponse> getDiaryDetail(
      @PathVariable Integer id) {

    return new SuccessResponse<>(diaryService.findDiaryDetail(id));
  }

  @Operation(summary = "일기 리스트 조회", description = "일기 리스트를 조회한다.")
  @GetMapping("/list")
  public SuccessResponse<List<DiaryListResponse>> getDiaryList(
      @AuthenticationPrincipal UserDetail userDetail) {
    if (userDetail == null) {
      throw new CustomException(ErrorCode.NO_AUTHENTICATED_USER_FOUND);
    }
    Long userId = userDetail.getId();

    return new SuccessResponse<>(diaryService.findDiaryList(userId));
  }

  @Operation(summary = "일기 작성", description = "일기를 작성한다.")
  @PostMapping
  public void addDiary(
      @RequestPart List<MultipartFile> files,
      @RequestPart DiaryAddRequest diaryAddRequest,
      @AuthenticationPrincipal UserDetail userDetail) {
    if (userDetail == null) {
      throw new CustomException(ErrorCode.NO_AUTHENTICATED_USER_FOUND);
    }
    Long userId = userDetail.getId();

    diaryService.saveDiary(userId, files, diaryAddRequest);
  }

  @Operation(summary = "일기 수정", description = "일기를 수정한다.")
  @PutMapping("/{id}")
  public void updateDiary(
      @RequestBody DiaryUpdateRequest diaryUpdateRequest) {

    diaryService.ModifyDiary(diaryUpdateRequest);
  }
}
