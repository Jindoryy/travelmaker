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
                if (travel.getFriends() != null && !travel.getFriends().isEmpty()) {
                    String[] friendIds = travel.getFriends().split(",");

                    for (String friendId : friendIds) {
                        try {
                            Long userId = Long.parseLong(friendId.trim());
                            updateUserStatusAfterCourse(userId);

                        } catch (NumberFormatException e) {
                            // 친구 ID가 유효하지 않은 경우 예외 처리
                            // 필요에 따라 로그를 남기거나 예외 처리를 수행합니다.
                            e.printStackTrace();
                        }
                    }
                }
            } else if (today.isAfter(travel.getEndDate())) {
                updateUserStatusBeforeCourse(travel.getUser().getId());
                if (travel.getFriends() != null && !travel.getFriends().isEmpty()) {
                    String[] friendIds = travel.getFriends().split(",");

                    for (String friendId : friendIds) {
                        try {
                            Long userId = Long.parseLong(friendId.trim());
                            updateUserStatusBeforeCourse(userId);

                        } catch (NumberFormatException e) {
                            // 친구 ID가 유효하지 않은 경우 예외 처리
                            // 필요에 따라 로그를 남기거나 예외 처리를 수행합니다.
                            e.printStackTrace();
                        }
                    }
                }
            } else if (today.isAfter(travel.getStartDate()) || today.equals(travel.getStartDate())) {
                updateUserStatusOnCourse(travel.getUser().getId());
                if (travel.getFriends() != null && !travel.getFriends().isEmpty()) {
                    String[] friendIds = travel.getFriends().split(",");

                    for (String friendId : friendIds) {
                        try {
                            Long userId = Long.parseLong(friendId.trim());
                            updateUserStatusOnCourse(userId);

                        } catch (NumberFormatException e) {
                            // 친구 ID가 유효하지 않은 경우 예외 처리
                            // 필요에 따라 로그를 남기거나 예외 처리를 수행합니다.
                            e.printStackTrace();
                        }
                    }
                }
            }else{
                updateUserStatusBeforeCourse(travel.getUser().getId());
                if (travel.getFriends() != null && !travel.getFriends().isEmpty()) {
                    String[] friendIds = travel.getFriends().split(",");

                    for (String friendId : friendIds) {
                        try {
                            Long userId = Long.parseLong(friendId.trim());
                            updateUserStatusBeforeCourse(userId);

                        } catch (NumberFormatException e) {
                            // 친구 ID가 유효하지 않은 경우 예외 처리
                            // 필요에 따라 로그를 남기거나 예외 처리를 수행합니다.
                            e.printStackTrace();
                        }
                    }
                }
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
