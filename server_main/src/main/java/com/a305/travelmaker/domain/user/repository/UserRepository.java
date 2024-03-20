package com.a305.travelmaker.domain.user.repository;

import com.a305.travelmaker.domain.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByKakaoId(Long kakaoId);
}
