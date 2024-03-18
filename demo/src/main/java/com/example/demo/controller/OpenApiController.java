package com.example.demo.controller;

import java.io.UnsupportedEncodingException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.service.OpenApiService;

@RestController
public class OpenApiController {
    private final OpenApiService openApiService;

    public OpenApiController(OpenApiService openApiService) {
        this.openApiService = openApiService;
    }

    @GetMapping("/open-api")
    public ResponseEntity<?> fetch() throws UnsupportedEncodingException {
        openApiService.fetchAndSave(); // fetchAndSave() 메서드 호출
        return ResponseEntity.ok().build(); // ResponseEntity 반환
    }
}
