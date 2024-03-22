package com.a305.travelmaker.domain.likes.repository;

import com.a305.travelmaker.domain.likes.entity.Likes;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface LikesRepository extends JpaRepository<Likes, Long> {

    @Query("SELECT l FROM Likes l WHERE l.userId.id = :userId AND l.destinationId.id = :destinationId")
    Optional<Likes> findByUserIdAndDestinationId(Long userId, Integer destinationId);

}
