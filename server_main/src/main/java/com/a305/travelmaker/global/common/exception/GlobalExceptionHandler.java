package com.a305.travelmaker.global.common.exception;

import com.a305.travelmaker.global.common.dto.FailResponse;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<FailResponse<Map<String, String>>> handle(CustomException exc) {
        ErrorCode errorCode = exc.getErrorCode();

        return new ResponseEntity<>(
            FailResponse.of(String.valueOf(errorCode.getStatus()), errorCode.getMessage()),
            HttpStatusCode.valueOf(errorCode.getStatus()));
    }

}
