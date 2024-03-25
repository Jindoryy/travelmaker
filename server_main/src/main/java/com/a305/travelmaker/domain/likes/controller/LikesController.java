package com.a305.travelmaker.domain.likes.controller;

import com.a305.travelmaker.domain.likes.service.LikesService;
import com.a305.travelmaker.global.common.dto.FailResponse;
import com.a305.travelmaker.global.common.dto.SuccessResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/like")
@Tag(name = "Like", description = "좋아요 API")
public class LikesController {

    private final LikesService likesService;

    @Operation(summary = "좋아요 추가, 취소", description = "좋아요를 추가하고 취소한다.")
    @PostMapping
    public ResponseEntity<?> requestLike(@RequestBody Map<String, Object> body) {
        Long userId = Long.valueOf((Integer) body.get("userId"));
        Integer destinationId = (Integer) body.get("destinationId");

        try {
            likesService.addLike(userId, destinationId);
            return ResponseEntity.ok(new SuccessResponse<>("like success"));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new FailResponse<>("like fail"));
        }
    }

    @Operation(summary = "토큰 검사 후, 좋아요 추가, 취소", description = "좋아요를 추가하고 취소한다.")
    @PostMapping("/token")
    public ResponseEntity<?> requestLikeToken(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        Long userId = Long.valueOf((Integer) body.get("userId"));
        Integer destinationId = (Integer) body.get("destinationId");

        boolean isIdCheck = likesService.tokenCheck(userId, token);
        if (isIdCheck) {
            try {
                likesService.addLike(userId, destinationId);
                return ResponseEntity.ok(new SuccessResponse<>("like success"));
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new FailResponse<>("like fail"));
            }
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new FailResponse<>("token mismatch"));
        }
    }
}
