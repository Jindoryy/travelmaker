package com.a305.travelmaker.domain.destination.service;

import com.a305.travelmaker.domain.destination.dto.DestinationListResponse;
import com.a305.travelmaker.domain.destination.dto.DestinationRecommend;
import com.a305.travelmaker.domain.destination.dto.DestinationRecommendResponse;
import com.a305.travelmaker.domain.destination.entity.Destination;
import com.a305.travelmaker.domain.destination.repository.DestinationRepository;
import com.a305.travelmaker.domain.travel.dto.Point;
import com.a305.travelmaker.global.common.dto.DestinationDistanceResponse;
import com.a305.travelmaker.global.config.RestConfig;
import com.a305.travelmaker.global.util.HarversineUtil;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DestinationService {

  private final RestConfig restConfig;
  private final DestinationRepository destinationRepository;
  private final HarversineUtil harversineUtil;
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
          .destinationName(destination.getName())
          .destinationImgUrl(destination.getImgUrl())
          .build());
    }

    return destinationListResponseList;
  }

  public List<DestinationListResponse> findDestinationList(Long userId) {

    List<DestinationListResponse> destinationListResponseList = new ArrayList<>();
    List<Integer> likeCbfList = restConfig.restTemplate()
        .getForObject(bigdataServerDomain + "/recommend/main-list" + userId, List.class);

    for (Integer id : likeCbfList) {

      Destination destination = destinationRepository.findById(id).get();

      destinationListResponseList.add(DestinationListResponse.builder()
          .destinationId(destination.getId())
          .destinationType(destination.getType())
          .destinationName(destination.getName())
          .destinationImgUrl(destination.getImgUrl())
          .build());
    }

    return destinationListResponseList;
  }

  public DestinationRecommendResponse findDestinationRecommend(
      Long userId,
      int cityId,
      List<Integer> friendTag) {

    DestinationRecommend destinationRecommend = DestinationRecommend.builder()
        .userId(userId)
        .cityId(cityId)
        .build();

    // 친구가 있는 경우에 대한 친구 ID를 담아서 장고 서버로 보내는 로직 필요 - 장고 서버에서 오는 데이터 그대로 반환
    Map<String, List<Integer>> destinationRecommendResponse = restConfig.restTemplate()
        .postForObject(bigdataServerDomain + "/recommend/city-list", destinationRecommend,
            HashMap.class);

    return DestinationRecommendResponse.builder()
        .DestinationRecommendList(destinationRecommendResponse)
        .build();
  }


}
