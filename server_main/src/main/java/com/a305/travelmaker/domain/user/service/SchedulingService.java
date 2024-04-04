package com.a305.travelmaker.domain.user.service;

import com.a305.travelmaker.domain.travel.entity.Travel;
import com.a305.travelmaker.domain.travel.repository.TravelRepository;
import com.a305.travelmaker.domain.user.service.UserService;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SchedulingService {

    private final TravelRepository travelRepository;
    private final UserService userService;

    @Scheduled(cron = "0 0 0 * * *") // 자정마다 스케줄링 실행
    public void updateUsersBasedOnTravelDates() {
        LocalDate today = LocalDate.now();

        List<Travel> travels = travelRepository.findTravelsAfterToday();

        // travels 리스트를 endDate를 기준으로 내림차순으로 정렬합니다.
        travels.sort(Comparator.comparing(Travel::getEndDate).reversed());

        for (Travel travel : travels) {
            LocalDate twoWeeksAfterStartDate = today.plusWeeks(2);
            if (!travel.getStartDate().isAfter(twoWeeksAfterStartDate) && travel.getStartDate().isAfter(today)) {

                updateUserStatusAfterCourse(travel.getUser().getId());

            } else if (today.isAfter(travel.getEndDate())) {
                updateUserStatusBeforeCourse(travel.getUser().getId());

            } else if (today.isAfter(travel.getStartDate()) || today.equals(travel.getStartDate())) {
                updateUserStatusOnCourse(travel.getUser().getId());

            }else{
                updateUserStatusBeforeCourse(travel.getUser().getId());

            }
        }
    }

    public void updateUserStatusAfterCourse(Long userId) {
        userService.updateUserStatusAfterCourse(userId);
    }

    public void updateUserStatusOnCourse(Long userId) {
        userService.updateUserStatusOnCourse(userId);
    }

    public void updateUserStatusBeforeCourse(Long userId) {
        userService.updateUserStatusBeforeCourse(userId);
    }
}
