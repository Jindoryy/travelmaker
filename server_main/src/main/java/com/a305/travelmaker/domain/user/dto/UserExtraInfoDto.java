package com.a305.travelmaker.domain.user.dto;

import java.time.LocalDate;
import lombok.Getter;

@Getter
public class UserExtraInfoDto {

    private Long userId;
    private GenderStatus gender;
    private LocalDate birth;
}
