package com.a305.travelmaker.domain.user.controller;

import com.a305.travelmaker.domain.user.service.SchedulingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/scheduling")
@RequiredArgsConstructor
public class SchedulingController {

    private final SchedulingService schedulingService;

    @GetMapping("/trigger-update")
    public String triggerUpdate() {
        schedulingService.updateUsersBasedOnTravelDates();
        return "Scheduled update triggered successfully";
    }
}
