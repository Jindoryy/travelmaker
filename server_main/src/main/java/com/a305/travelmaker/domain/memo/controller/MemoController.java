package com.a305.travelmaker.domain.memo.controller;

import com.a305.travelmaker.domain.memo.dto.MemoRequest;
import com.a305.travelmaker.domain.memo.dto.MemoResponse;
import com.a305.travelmaker.domain.memo.service.MemoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/Memo")
@Tag(name = "Memo", description = "메모 API")
public class MemoController {
    private final MemoService memoService;

    @PostMapping
    @Operation(summary = "Create Memo", responses = {
        @ApiResponse(responseCode = "201", description = "Memo created"),
        @ApiResponse(responseCode = "400", description = "Invalid request")
    })
    public ResponseEntity<MemoResponse> createMemo(
        @RequestBody MemoRequest memoRequest) {
        MemoResponse createdMemo = memoService.createMemo(memoRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdMemo);
    }



    @DeleteMapping("/{memoId}")
    @Operation(summary = "Delete Memo", responses = {
        @ApiResponse(responseCode = "204", description = "Memo deleted"),
        @ApiResponse(responseCode = "404", description = "Memo not found")
    })
    public ResponseEntity<Void> deleteMemo(
        @Parameter(description = "Memo ID") @PathVariable Integer memoId) {
        memoService.deleteMemo(memoId);
        return ResponseEntity.noContent().build();
    }


    @PutMapping("/{memoId}")
    @Operation(summary = "Update Memo", responses = {
        @ApiResponse(responseCode = "200", description = "Memo updated"),
        @ApiResponse(responseCode = "400", description = "Invalid request"),
        @ApiResponse(responseCode = "404", description = "Memo not found")
    })
    public ResponseEntity<MemoResponse> updateMemo(
        @Parameter(description = "Memo ID") @PathVariable Integer memoId,
        @RequestBody MemoRequest memoRequest) {
        MemoResponse updatedMemo = memoService.updateMemo(memoId, memoRequest);
        return ResponseEntity.ok(updatedMemo);
    }

    @GetMapping("/list/{travelId}")
    @Operation(summary = "Get All Memos by Travel ID", responses = {
        @ApiResponse(responseCode = "200", description = "Found Memos"),
        @ApiResponse(responseCode = "404", description = "No Memos found")
    })
    public ResponseEntity<List<MemoResponse>> getAllMemosByTravelId(
        @Parameter(description = "Travel ID") @PathVariable Integer travelId) {
        List<MemoResponse> memoDtos = (List<MemoResponse>) memoService.getAllMemosByTravelId(travelId);
        return ResponseEntity.ok(memoDtos);
    }
}
