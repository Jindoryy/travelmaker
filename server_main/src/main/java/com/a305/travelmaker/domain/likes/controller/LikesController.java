package com.a305.travelmaker.domain.likes.controller;

import com.a305.travelmaker.domain.likes.dto.LikesRequest;
import com.a305.travelmaker.domain.likes.service.LikesService;
import com.a305.travelmaker.domain.login.dto.UserDetail;
import com.a305.travelmaker.global.common.dto.FailResponse;
import com.a305.travelmaker.global.common.dto.SuccessResponse;
import com.a305.travelmaker.global.common.exception.CustomException;
import com.a305.travelmaker.global.common.exception.ErrorCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    @PostMapping("")
    public ResponseEntity<?> requestLikeToken(@RequestBody LikesRequest likesRequset, @AuthenticationPrincipal UserDetail userDetail) {
        if (userDetail == null) {
            throw new CustomException(ErrorCode.NO_AUTHENTICATED_USER_FOUND);
        }
        Long userId = userDetail.getId();

        boolean isIdCheck = likesService.tokenCheck(likesRequset.getUserId(), userId);
        if (isIdCheck) {
            try {
                boolean isAdded = likesService.addLike(likesRequset);
                if (isAdded) {
                    return ResponseEntity.ok(new SuccessResponse<>("add"));
                } else {
                    return ResponseEntity.ok(new SuccessResponse<>("cancel"));
                }
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new FailResponse<>("like fail"));
            }
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new FailResponse<>("token mismatch"));
        }
    }
}
