package com.a305.travelmaker.domain.likes.repository;

import com.a305.travelmaker.domain.destination.entity.Destination;
import com.a305.travelmaker.domain.likes.entity.Likes;
import com.a305.travelmaker.domain.user.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikesRepository extends JpaRepository<Likes, Long> {

    Optional<Object> findByUserIdAndDestinationId(User userId, Destination destinationId);
}
