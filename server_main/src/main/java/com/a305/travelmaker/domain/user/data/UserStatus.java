package com.a305.travelmaker.domain.user.data;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum UserStatus {
    BEFORE_COURSE("BEFORE_COURSE"),
    ON_COURSE("ON_COURSE"),
    AFTER_COURSE("AFTER_COURSE");

    private String value;
}