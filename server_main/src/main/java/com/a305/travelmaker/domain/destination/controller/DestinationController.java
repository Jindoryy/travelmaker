package com.a305.travelmaker.domain.destination.controller;

import com.a305.travelmaker.domain.destination.dto.DestinationDetailResponse;
import com.a305.travelmaker.domain.destination.dto.DestinationListResponse;
import com.a305.travelmaker.domain.destination.dto.DestinationRecommendResponse;
import com.a305.travelmaker.domain.destination.service.DestinationService;
import com.a305.travelmaker.global.common.dto.DestinationDistanceResponse;
import com.a305.travelmaker.global.common.dto.SuccessResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/destination")
@Tag(name = "Destination", description = "장소 API")
public class DestinationController {

  private final DestinationService destinationService;

  @Operation(summary = "장소 거리 조회", description = "장소들 간의 거리를 조회한다.")
  @GetMapping("/distance")
  public SuccessResponse<List<DestinationDistanceResponse>> getDestinationDistance(
      @RequestParam List<Integer> destinationsIdList) {

    return new SuccessResponse<>(destinationService.findDestinationDistance(destinationsIdList));
  }

  @Operation(summary = "장소 조회", description = "장소 정보를 조회한다.")
  @GetMapping("/{id}")
  public SuccessResponse<DestinationDetailResponse> getDestinationDetail(@PathVariable Integer id) {

    return new SuccessResponse<>(destinationService.findDestinationDetail(id));
  }

  @Operation(summary = "장소 리스트 조회", description = "장소 리스트를 조회한다.")
  @GetMapping("/list")
  public SuccessResponse<List<DestinationListResponse>> getDestinationList() {

    return new SuccessResponse<>(destinationService.findDestinationList());
  }

  @Operation(summary = "추천 리스트 조회", description = "추천 리스트를 조회한다.")
  @GetMapping("/recommend")
  public SuccessResponse<DestinationRecommendResponse> getDestinationRecommend(
      @RequestParam int cityId,
      @RequestParam(required = false) List<Integer> friendTags) {

    return new SuccessResponse<>(destinationService.findDestinationRecommend(cityId, friendTags));
  }
}
