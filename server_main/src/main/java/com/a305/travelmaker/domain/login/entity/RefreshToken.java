package com.a305.travelmaker.domain.login.entity;

import com.a305.travelmaker.domain.user.entity.User;
import com.a305.travelmaker.global.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "REFRESHTOKEN")
public class RefreshToken extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "refresh_token_id")
    private Long id;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(length = 500)
    private String token;

    @Column
    private Boolean isExpired;

    @Column
    private LocalDateTime expireDate;

    public boolean isValid(LocalDateTime now) {

        if (isExpired) {
            return false;
        }
        return expireDate.isAfter(now);
    }

    public void setIsExpired() {

        this.isExpired = true;
    }

    public void setUserRefreshToken(User user, String token, long tokenExpiredSecond) {

        this.user = user;
        this.token = token;
        this.isExpired = false;
        this.expireDate = LocalDateTime.now().plusSeconds(tokenExpiredSecond);
    }
}
