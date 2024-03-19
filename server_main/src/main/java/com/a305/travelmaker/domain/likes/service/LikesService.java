package com.a305.travelmaker.domain.likes.service;

import com.a305.travelmaker.domain.destination.entity.Destination;
import com.a305.travelmaker.domain.likes.dto.LikesResponse;
import com.a305.travelmaker.domain.likes.entity.Likes;
import com.a305.travelmaker.domain.likes.repository.LikesRepository;
import com.a305.travelmaker.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LikesService {

    private final LikesRepository likesRepository;

    //좋아요 추가
    /**
     * 유저id & 장소id로 검색해서
     * 1) 일치하는 데이터가 없을 때 : insert
     * 2) 일치하는 데이터가 있을 때 : delete
     *  https://velog.io/@cjy/%EC%A2%8B%EC%95%84%EC%9A%94-%EC%82%AD%EC%A0%9C-%EA%B8%B0%EB%8A%A5-%EA%B0%9C%EC%84%A0
     */

    public void addOrCancelLike(User userId, Destination destinationId) {
        Likes like = (Likes) likesRepository.findByUserIdAndDestinationId(userId, destinationId).orElse(null);

        if (like == null) {
            //좋아요 추가
            Likes newLike = Likes.builder()
                .userId(userId)
                .destinationId(destinationId)
                .flag(true)
                .build();
            likesRepository.save(newLike);
        } else {
            //좋아요 취소
            likesRepository.delete(like);
        }
    }

}
