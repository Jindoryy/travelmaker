package com.a305.travelmaker.domain.destination.controller;

import com.a305.travelmaker.domain.destination.dto.DestinationListResponse;
import com.a305.travelmaker.domain.destination.dto.DestinationRecommendResponse;
import com.a305.travelmaker.domain.destination.service.DestinationService;
import com.a305.travelmaker.global.common.dto.DestinationDistanceResponse;
import com.a305.travelmaker.global.common.dto.SuccessResponse;
import com.a305.travelmaker.global.common.jwt.TokenProvider;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/destination")
@Tag(name = "Destination", description = "장소 API")
public class DestinationController {

  private final DestinationService destinationService;
  private final TokenProvider tokenProvider;

  @Operation(summary = "장소 거리 조회", description = "장소들 간의 거리를 조회한다.")
  @GetMapping("/distance")
  public SuccessResponse<List<DestinationDistanceResponse>> getDestinationDistance(
      @RequestParam List<Integer> destinationsIdList) {

    return new SuccessResponse<>(destinationService.findDestinationDistance(destinationsIdList));
  }

  @Operation(summary = "장소 조회", description = "장소 정보를 조회한다.")
  @GetMapping
  public SuccessResponse<List<DestinationListResponse>> getDestinationDetail(
      @RequestParam List<Integer> destinationsIdList) {

    return new SuccessResponse<>(destinationService.findDestinationDetail(destinationsIdList));
  }

  @Operation(summary = "CF 장소 목록", description = "CF 장소 목록 조회한다.")
  @GetMapping("/list")
  public SuccessResponse<List<DestinationListResponse>> getDestinationList(
      HttpServletRequest request
  ) {

    String token = request.getHeader("Authorization").substring(7);
    Long userId = tokenProvider.getUserIdFromToken(token);

    return new SuccessResponse<>(destinationService.findDestinationList(userId));
  }

  @Operation(summary = "추천 리스트 조회", description = "추천 리스트를 조회한다.")
  @GetMapping("/recommend")
  public SuccessResponse<DestinationRecommendResponse> getDestinationRecommend(
      @RequestParam int cityId,
      @RequestParam(required = false) List<Long> friendIdList,
      HttpServletRequest request) {

    String token = request.getHeader("Authorization").substring(7);
    Long userId = tokenProvider.getUserIdFromToken(token);

    return new SuccessResponse<>(destinationService.findDestinationRecommend(userId, cityId, friendIdList));
  }
}
