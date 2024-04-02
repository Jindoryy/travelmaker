package com.a305.travelmaker.domain.destination.service;

import com.a305.travelmaker.domain.destination.dto.DestinationCfListResponse;
import com.a305.travelmaker.domain.destination.dto.DestinationListResponse;
import com.a305.travelmaker.domain.destination.dto.DestinationRecommend;
import com.a305.travelmaker.domain.destination.dto.DestinationRecommendResponse;
import com.a305.travelmaker.domain.destination.entity.Destination;
import com.a305.travelmaker.domain.destination.repository.DestinationRepository;
import com.a305.travelmaker.domain.likes.entity.Likes;
import com.a305.travelmaker.domain.likes.repository.LikesRepository;
import com.a305.travelmaker.domain.travel.dto.Point;
import com.a305.travelmaker.global.common.dto.DestinationDistanceResponse;
import com.a305.travelmaker.global.config.RestConfig;
import com.a305.travelmaker.global.util.HarversineUtil;
import com.google.gson.Gson;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DestinationService {

  private final RestConfig restConfig;
  private final DestinationRepository destinationRepository;
  private final HarversineUtil harversineUtil;
  private final LikesRepository likesRepository;
  private Point prevPoint, currentPoint;
  @Value("${bigdata.server.domain}")
  private String bigdataServerDomain;

  @Transactional
  public List<DestinationDistanceResponse> findDestinationDistance(
      List<Integer> destinationsIdList) {

    // 장소 ID 리스트를 0 ~ N-1까지 반복문을 돌면서 하버사인 공식을 이용하여 거리 계산 후 DTO에 담아 반환
    List<DestinationDistanceResponse> destinationDistanceResponses = new ArrayList<>();

    prevPoint = null;
    for (Integer destinationId : destinationsIdList) {

      Destination destination = destinationRepository.findById(destinationId).orElse(null);
      if (destination == null) {
        continue;
      }

      currentPoint = Point.builder()
          .destinationId(destination.getId())
          .latitude(destination.getLatitude())
          .longitude(destination.getLongitude())
          .build();

      if (prevPoint != null) {
        // 이전 목적지가 있는 경우에만 거리 계산을 수행하고 이전 목적지에 거리를 설정
        double distance = harversineUtil.calculateDistance(prevPoint, currentPoint);
        destinationDistanceResponses.get(destinationDistanceResponses.size() - 1)
            .setNextDestinationDistance(distance);
      }

      // 현재 목적지 정보를 추가
      destinationDistanceResponses.add(DestinationDistanceResponse.builder()
          .point(currentPoint)
          .destinationName(destination.getName())
          .destinationType(destination.getType())
          .destinationImgUrl(destination.getImgUrl())
          .build());

      // 현재 목적지 정보를 이전 목적지로 업데이트
      prevPoint = currentPoint;
    }

    return destinationDistanceResponses;
  }

  public List<DestinationListResponse> findDestinationDetail(List<Integer> destinationsIdList) {

    List<DestinationListResponse> destinationListResponseList = new ArrayList<>();

    for (Integer id : destinationsIdList) {

      Destination destination = destinationRepository.findById(id).get();

      destinationListResponseList.add(DestinationListResponse.builder()
          .destinationId(destination.getId())
          .destinationType(destination.getType())
          .destinationContent(destination.getContent())
          .destinationName(destination.getName())
          .destinationImgUrl(destination.getImgUrl())
          .build());
    }

    return destinationListResponseList;
  }

  public DestinationRecommendResponse findDestinationRecommend(
      Long userId,
      int cityId,
      List<Long> friendIdList) {

    List<Long> userIdList = new ArrayList<>();
    userIdList.add(userId);
    if (friendIdList != null && !friendIdList.isEmpty()) {
      for (int i = 0; i < friendIdList.size(); i++) {

        userIdList.add(friendIdList.get(i));
      }
    }

    DestinationRecommend destinationRecommend = DestinationRecommend.builder()
        .userId(userIdList)
        .cityId(cityId)
        .build();

    // Gson을 사용하여 JSON 문자열로 변환
    Gson gson = new Gson();
    String json = gson.toJson(destinationRecommend);

    // HTTP 요청 설정
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    HttpEntity<String> requestEntity = new HttpEntity<>(json, headers);

    Map<String, List<Integer>> destinationRecommendResponse = restConfig.restTemplate()
        .postForObject(bigdataServerDomain + "/recommend/city-list",
            requestEntity,
            HashMap.class);

    return DestinationRecommendResponse.builder()
        .DestinationRecommendList(destinationRecommendResponse)
        .build();
  }

  public DestinationCfListResponse findDestinationList(Long userId) {

    Map<String, List<DestinationListResponse>> destinationListResponseMap = new HashMap<>();

    Map<String, List<Integer>> likeCbfList = restConfig.restTemplate()
        .getForObject(bigdataServerDomain + "/recommend/main-list/" + userId, HashMap.class);

    for (Map.Entry<String, List<Integer>> entry : likeCbfList.entrySet()) {

      String type = entry.getKey();
      List<Integer> destinationIdList = entry.getValue(); // 장소 ID를 담는 리스트
      List<DestinationListResponse> destinationListResponseList = new ArrayList<>();

      for (Integer id : destinationIdList) {

        Destination destination = destinationRepository.findById(id).get();
        Optional<Likes> likesOptional = likesRepository.findByUserIdAndDestinationId(userId, destination.getId());
        boolean likesFlag = likesOptional.map(Likes::getFlag).orElse(false);

        if (likesFlag) {
          likesFlag = true;
        }

        DestinationListResponse destinationListResponse = DestinationListResponse.builder()
            .destinationId(destination.getId())
            .destinationName(destination.getName())
            .destinationContent(destination.getContent())
            .destinationImgUrl(destination.getImgUrl())
            .likes_flag(likesFlag)
            .build();

        destinationListResponseList.add(destinationListResponse);
      }

      destinationListResponseMap.put(type, destinationListResponseList);
    }

    return DestinationCfListResponse.builder()
        .destinationListResponseMap(destinationListResponseMap)
        .build();
  }

  public DestinationCfListResponse findDestinationListNonLogin() {

    Map<String, List<DestinationListResponse>> destinationListResponseMap = new HashMap<>();

    List<DestinationListResponse> destinationListResponseList = new ArrayList<>();

    List<Destination> destinationList = destinationRepository.findRandom30Destinations(); // 장소 ID를 담는 리스트


    for (Destination destination : destinationList) {

      DestinationListResponse destinationListResponse = DestinationListResponse.builder()
          .destinationId(destination.getId())
          .destinationName(destination.getName())
          .destinationContent(destination.getContent())
          .destinationImgUrl(destination.getImgUrl())
          .build();

      destinationListResponseList.add(destinationListResponse);
    }

    destinationListResponseMap.put("basic", destinationListResponseList);

    return DestinationCfListResponse.builder()
        .destinationListResponseMap(destinationListResponseMap)
        .build();
  }
}