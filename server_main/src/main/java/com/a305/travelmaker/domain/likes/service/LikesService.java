package com.a305.travelmaker.domain.likes.service;

import com.a305.travelmaker.domain.destination.entity.Destination;
import com.a305.travelmaker.domain.destination.repository.DestinationRepository;
import com.a305.travelmaker.domain.likes.entity.Likes;
import com.a305.travelmaker.domain.likes.repository.LikesRepository;
import com.a305.travelmaker.domain.user.entity.User;
import com.a305.travelmaker.domain.user.repository.UserRepository;
import com.a305.travelmaker.global.common.jwt.TokenProvider;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LikesService {

    private final LikesRepository likesRepository;
    private final DestinationRepository destinationRepository;
    private final UserRepository userRepository;
    private final TokenProvider tokenProvider;

    public boolean tokenCheck(Long userId, String token) {
        //userId와 token에서 가져온 UserId 비교
        Long tokenUserId = tokenProvider.getUserIdFromToken(token);
        return userId.equals(tokenUserId);
    }

    public void addLike(Long userId, Integer destinationId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        User user = optionalUser.orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        Optional<Destination> optionalDestination = destinationRepository.findById(destinationId);
        Destination destination = optionalDestination.orElseThrow(() -> new IllegalArgumentException("Destination not found with ID: " + destinationId));

        Optional<Likes> optionalLikes = likesRepository.findByUserIdAndDestinationId(user.getId(), destination.getId());

        if (optionalLikes.isEmpty()) {
            //좋아요 생성
            Likes newLike = Likes.builder()
                .destinationId(destination)
                .userId(user)
                .flag(true)
                .build();
            likesRepository.save(newLike);
        } else {
            //한번이라도 이력이 있는 장소에 대해서 flag 업데이트
            Likes existingLike = optionalLikes.get();
            existingLike.setFlag(!existingLike.getFlag());
            likesRepository.save(existingLike);
        }
    }
}
