package com.a305.travelmaker.domain.travel.controller;

import com.a305.travelmaker.domain.login.dto.UserDetail;
import com.a305.travelmaker.domain.travel.dto.AfterCourseResponse;
import com.a305.travelmaker.domain.travel.dto.OnCourseResponse;
import com.a305.travelmaker.domain.travel.dto.TravelInfoRequest;
import com.a305.travelmaker.domain.travel.dto.TravelInfoResponse;
import com.a305.travelmaker.domain.travel.dto.TravelListResponse;
import com.a305.travelmaker.domain.travel.dto.TravelRequest;
import com.a305.travelmaker.domain.travel.dto.TravelResponse;
import com.a305.travelmaker.domain.travel.service.TravelService;
import com.a305.travelmaker.global.common.dto.SuccessResponse;
import com.a305.travelmaker.global.common.exception.CustomException;
import com.a305.travelmaker.global.common.exception.ErrorCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/travel")
@Tag(name = "Travel", description = "여행 API")
public class TravelController {

  private final TravelService travelService;

  @Operation(summary = "여행 상세 정보", description = "여행 상세 정보를 조회한다.")
  @GetMapping("/{id}")
  public SuccessResponse<TravelInfoResponse> getTravelInfo(@PathVariable Integer id) {

    return new SuccessResponse<>(travelService.findTravelInfo(id));
  }

  @Operation(summary = "여행 정보 생성", description = "여행 정보를 생성한다.")
  @PostMapping
  public SuccessResponse<TravelResponse> makeTravel(@RequestBody TravelRequest travelRequest) {

    return new SuccessResponse<>(travelService.createTravel(travelRequest));
  }

  @Operation(summary = "여행 정보 저장", description = "여행 정보를 저장한다.")
  @PostMapping("/info")
  public void addTravel(@RequestBody TravelInfoRequest travelInfoRequest,
      @AuthenticationPrincipal UserDetail userDetail) {
    if (userDetail == null) {
      throw new CustomException(ErrorCode.NO_AUTHENTICATED_USER_FOUND);
    }
    Long userId = userDetail.getId();

    travelService.saveTravel(userId, travelInfoRequest);
  }

  @Operation(summary = "여행 정보 조회 (메인 페이지 - 코스후)", description = "여행 정보를 조회한다.")
  @GetMapping("/main-before/{id}")
  public SuccessResponse<AfterCourseResponse> getTravelBeforeDetail(@PathVariable Integer id) {

    return new SuccessResponse<>(travelService.findTravelBeforeDetail(id));
  }

  @Operation(summary = "여행 정보 조회 (메인 페이지 - 여행중)", description = "여행 정보를 조회한다.")
  @GetMapping("/main-after/{id}")
  public SuccessResponse<OnCourseResponse> getTravelAfterDetail(@PathVariable Integer id) {

    return new SuccessResponse<>(travelService.findTravelAfterDetail(id));
  }

  @Operation(summary = "여행 리스트 조회", description = "여행 리스트를 조회한다.")
  @GetMapping("/list")
  public SuccessResponse<List<TravelListResponse>> getTravelList(
      @AuthenticationPrincipal UserDetail userDetail) {
    if (userDetail == null) {
      throw new CustomException(ErrorCode.NO_AUTHENTICATED_USER_FOUND);
    }
    Long userId = userDetail.getId();

    return new SuccessResponse<>(travelService.findTravelList(userId));
  }

  @Operation(summary = "여행 삭제", description = "여행을 삭제한다.")
  @DeleteMapping("/{id}")
  public void deleteTravel(@PathVariable Integer id) {

    travelService.removeTravel(id);
  }
}
