package com.a305.travelmaker.domain.user.repository;


import com.a305.travelmaker.domain.user.entity.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByKakaoId(Long kakaoId);

    // 닉네임으로 사용자 검색 (닉네임의 일부로도 검색 가능)
    List<User> findByNicknameContaining(String nickname);

    // 태그로 사용자 검색 (정확한 일치만 검색)
    List<User> findByTag(int tag);

    boolean existsByTag(int randomNumber);
}
