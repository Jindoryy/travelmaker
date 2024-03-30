package com.a305.travelmaker.domain.city.controller;

import com.a305.travelmaker.domain.city.dto.CityResponse;
import com.a305.travelmaker.domain.city.service.CityService;
import com.a305.travelmaker.global.common.dto.SuccessResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/city")
@Tag(name = "City", description = "시 API")
public class CityController {

  private final CityService cityService;

  @Operation(summary = "시 인기 리스트 조회", description = "시 인기 리스트를 조회한다.")
  @GetMapping("/{id}")
  public SuccessResponse<List<CityResponse>> getCityList(@PathVariable Integer id) {

    return new SuccessResponse<>(cityService.findCityList(id));
  }

  @Operation(summary = "시 데이터 입력 (테스트)", description = "시 데이터 입력")
  @PostMapping
  public void addCity(
      @RequestParam MultipartFile file,
      @RequestParam String name) {

    cityService.saveCity(file, name);
  }
}
