// UserService.java

package com.a305.travelmaker.domain.user.service;

import com.a305.travelmaker.domain.user.dto.UserStatus;
import com.a305.travelmaker.domain.user.entity.User;
import com.a305.travelmaker.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;


    public String getUserStatus(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        return user.getStatus().toString();
    }

    public void updateUserStatusAfterCourse(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setStatus(UserStatus.AFTER_COURSE);
        userRepository.save(user);
    }

    public void updateUserStatusOnCourse(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setStatus(UserStatus.ON_COURSE);
        userRepository.save(user);
    }
}
