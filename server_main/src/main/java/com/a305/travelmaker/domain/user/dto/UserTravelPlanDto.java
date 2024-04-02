package com.a305.travelmaker.domain.user.dto;

import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserTravelPlanDto {

    private LocalDate startDate;
    private LocalDate endDate;

}
