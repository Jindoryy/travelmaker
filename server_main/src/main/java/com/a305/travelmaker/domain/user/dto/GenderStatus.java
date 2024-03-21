package com.a305.travelmaker.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum GenderStatus {

    MALE("MALE"),
    FEMALE("FEMALE");
    private final String value;
}
