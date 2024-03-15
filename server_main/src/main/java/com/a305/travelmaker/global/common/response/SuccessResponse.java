package com.a305.travelmaker.global.common.response;

public class SuccessResponse<T> extends BaseResponse<T> {

    public SuccessResponse(T data) {
        super("success", data);
    }
}
