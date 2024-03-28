package com.a305.travelmaker.domain.login.entity;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@Getter
@Builder
@RedisHash(value = "refreshToken", timeToLive = 604800)
public class RefreshTokenRedis {

  @Id
  private String refreshToken; // 리프레쉬 토큰 값
  private Long userId; // 사용자 ID
  private Boolean isExpired; // 토큰의 만료 여부
  private LocalDateTime expireDate; // 토큰의 만료 시간

  public boolean isValid(LocalDateTime now) {
    return !Boolean.TRUE.equals(isExpired) && !expireDate.isBefore(now);
  }

  public void setIsExpired() {
    this.isExpired = true;
  }
}
