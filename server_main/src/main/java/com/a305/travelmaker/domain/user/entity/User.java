package com.a305.travelmaker.domain.user.entity;

import com.a305.travelmaker.domain.course.entity.Course;
import com.a305.travelmaker.domain.travel.entity.Travel;
import com.a305.travelmaker.domain.user.dto.GenderStatus;
import com.a305.travelmaker.domain.user.dto.UserRole;
import com.a305.travelmaker.domain.user.dto.UserStatus;
import com.a305.travelmaker.global.common.BaseEntity;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "USER")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Travel> travelList = new ArrayList<>();

    @Column(nullable = false)
    private Long kakaoId;

    @Column(nullable = false)
    private int tag;

    @Column(nullable = false)
    private String nickname;

    @Column(nullable = false)
    private String email;

    @Column(length = 2000)
    private String profileUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private UserStatus status = UserStatus.BEFORE_COURSE;

    @Enumerated(EnumType.STRING)
    @Column
    private GenderStatus gender;

    @Column
    private LocalDate birth;

    @Enumerated(EnumType.STRING)

    @Builder.Default
    @Column(nullable = false)
    private UserRole role = UserRole.ROLE_USER;

    public Collection<String> getRoles() {
        Collection<String> roles = new ArrayList<>();
        roles.add(role.getValue());
        return roles;
    }
    public void updateGenderAndBirth(GenderStatus gender, LocalDate birth) {
        this.gender = gender;
        this.birth = birth;
    }

    public void updateStatus(UserStatus newStatus) {
        this.status = newStatus;
    }
}