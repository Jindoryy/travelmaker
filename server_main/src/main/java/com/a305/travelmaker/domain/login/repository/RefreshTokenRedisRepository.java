package com.a305.travelmaker.domain.login.repository;

import com.a305.travelmaker.domain.login.entity.RefreshTokenRedis;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefreshTokenRedisRepository extends CrudRepository<RefreshTokenRedis, String> {

  Optional<RefreshTokenRedis> findById(String refreshToken);
}
