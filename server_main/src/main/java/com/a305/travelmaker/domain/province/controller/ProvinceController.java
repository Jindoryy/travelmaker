package com.a305.travelmaker.domain.province.controller;

import com.a305.travelmaker.domain.province.service.ProvinceService;
import com.a305.travelmaker.domain.province.dto.ProvinceResponse;
import com.a305.travelmaker.global.common.dto.SuccessResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/province")
@Tag(name = "Province", description = "도 API")
public class ProvinceController {

  private final ProvinceService provinceService;

  @Operation(summary = "도 리스트 조회", description = "도 리스트를 조회한다.")
  @GetMapping("/list")
  public SuccessResponse<List<ProvinceResponse>> getProvinceList() {

    return new SuccessResponse<>(provinceService.findProvinceList());
  }

  @Operation(summary = "도 추천 리스트 조회", description = "도 추천 리스트를 조회한다.")
  @GetMapping("/recommend")
  public SuccessResponse<List<ProvinceResponse>> getProvinceRecommend() {

    return new SuccessResponse<>(provinceService.findProvinceRecommend());
  }

  @Operation(summary = "도 데이터 입력 (테스트)", description = "도 데이터 입력")
  @PostMapping
  public void addProvince(
      @RequestParam MultipartFile file,
      @RequestParam String name) {

    provinceService.saveProvince(file, name);
  }
}
