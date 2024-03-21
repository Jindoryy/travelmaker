package com.a305.travelmaker.global.common.dto;

import com.a305.travelmaker.global.common.exception.ErrorCode;
import java.util.Map;
import java.util.TreeMap;

public class FailResponse<T> extends BaseResponse<T> {
    public FailResponse(T data) {
        super("fail", data);
    }

    public static FailResponse<Map<String, String>> of(String errorCode, String message) {
        Map<String, String> data = new TreeMap<>();
        data.put("errorCode", errorCode);
        data.put("message", message);
        return new FailResponse<>(data);
    }

    public static FailResponse<Map<String, String>> of(ErrorCode errorCode) {
        Map<String, String> data = new TreeMap<>();
        data.put("errorCode", String.valueOf(errorCode.getStatus()));
        data.put("message", errorCode.getMessage());
        return new FailResponse<>(data);
    }
}
