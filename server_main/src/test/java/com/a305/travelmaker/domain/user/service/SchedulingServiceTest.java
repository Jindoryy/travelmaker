package com.a305.travelmaker.domain.user.service;

import static org.junit.jupiter.api.Assertions.*;

import com.a305.travelmaker.TravelmakerApplication;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
@SpringBootTest(classes = TravelmakerApplication.class)
@TestPropertySource(properties = {
    "scheduling.enabled=true" // 스케줄링 활성화
})
public class SchedulingServiceTest {

    @Autowired
    private SchedulingService schedulingService;

    @Test
    public void testScheduledTask() {
        // 테스트에서 스케줄링된 작업을 직접 호출
        schedulingService.updateUsersBasedOnTravelDates();
    }
}


