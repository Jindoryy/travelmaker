package com.a305.travelmaker.domain.travel.controller;

import com.a305.travelmaker.domain.travel.dto.TravelRequest;
import com.a305.travelmaker.domain.travel.dto.TravelResponse;
import com.a305.travelmaker.domain.travel.service.TravelService;
import com.a305.travelmaker.global.common.dto.SuccessResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
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
  @Operation(summary = "여행 저장", description = "여행 정보를 받아 저장한다.")
  @PostMapping
  public SuccessResponse<TravelResponse> addTravel(@RequestBody TravelRequest travelRequest) {
    System.out.println(travelRequest);
    return new SuccessResponse<>(travelService.saveTravel(travelRequest));
  }
}
