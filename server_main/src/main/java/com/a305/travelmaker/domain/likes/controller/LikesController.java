package com.a305.travelmaker.domain.likes.controller;

import com.a305.travelmaker.domain.destination.entity.Destination;
import com.a305.travelmaker.domain.likes.service.LikesService;
import com.a305.travelmaker.domain.user.entity.User;
import com.a305.travelmaker.global.common.response.SuccessResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Map;
import lombok.RequiredArgsConstructor;
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
    public SuccessResponse<String> requestLike(@RequestBody Map<String, Object> body) {
        User userId = (User) body.get("userId");
        Destination destinationId = (Destination) body.get("destinationId");

        likesService.addOrCancelLike(userId, destinationId);

        return new SuccessResponse<>("Success");
    }
}
