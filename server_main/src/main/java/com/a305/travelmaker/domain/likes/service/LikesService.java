package com.a305.travelmaker.domain.likes.service;

import com.a305.travelmaker.domain.destination.entity.Destination;
import com.a305.travelmaker.domain.destination.repository.DestinationRepository;
import com.a305.travelmaker.domain.likes.dto.LikesResponse;
import com.a305.travelmaker.domain.likes.entity.Likes;
import com.a305.travelmaker.domain.likes.repository.LikesRepository;
import com.a305.travelmaker.domain.user.entity.User;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LikesService {

    private final LikesRepository likesRepository;
    private final DestinationRepository destinationRepository;

    //좋아요 추가
    /**
     * 유저id & 장소id로 검색해서
     * 1) 일치하는 데이터가 없을 때 : insert
     * 2) 일치하는 데이터가 있을 때 : delete
     *  https://velog.io/@cjy/%EC%A2%8B%EC%95%84%EC%9A%94-%EC%82%AD%EC%A0%9C-%EA%B8%B0%EB%8A%A5-%EA%B0%9C%EC%84%A0
     */

    public void  addOrCancelLike(Long userId, Integer destinationId) {
        User user = User.builder().id(userId).build();
        Destination destination = Destination.builder().id(destinationId).build();

        Likes like = likesRepository.findByUserIdAndDestinationId(user, destination).orElse(null);
        System.out.println(like); //null인게 이상함

        if (like == null) {
            //좋아요 생성
            Likes newLike = Likes.builder()
                .destinationId(destination)
                .userId(user)
                .flag(true)
                .build();
//            System.out.println("========================");
//            System.out.println(destination.getId()); //잘나옴
//            System.out.println(newLike.getDestinationId().getId()); //잘나옴
            likesRepository.save(newLike);
            //근데 insert할 때 자꾸 null이래.......
        } else {
            //좋아요 삭제
            likesRepository.delete(like);
        }
    }

}
