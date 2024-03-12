package com.a305.travelmaker.domain.user.domain;

import com.a305.travelmaker.domain.user.data.UserStatus;
import com.a305.travelmaker.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "USER")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    // 사용자 태그를 저장하는 필드
    @Column(nullable = false)
    private int tag;

    // 사용자 닉네임을 저장하는 필드
    @Column(nullable = false)
    private String nickname;

    // 사용자 이메일을 저장하는 필드
    @Column(nullable = false)
    private String email;

    // 사용자 프로필 사진 URL을 저장하는 필드
    @Column(length = 2000)
    private String profileUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status = UserStatus.BEFORE_COURSE;
}
