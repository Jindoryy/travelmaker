package com.a305.travelmaker.domain.destination.service;

import com.a305.travelmaker.domain.destination.dto.DestinationDetailResponse;
import com.a305.travelmaker.domain.destination.dto.DestinationListResponse;
import com.a305.travelmaker.domain.destination.dto.DestinationRecommendResponse;
import com.a305.travelmaker.domain.destination.entity.Destination;
import com.a305.travelmaker.domain.destination.repository.DestinationRepository;
import com.a305.travelmaker.domain.travel.dto.Point;
import com.a305.travelmaker.global.common.dto.DestinationDistanceResponse;
import com.a305.travelmaker.global.util.HarversineUtil;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DestinationService {

  private final DestinationRepository destinationRepository;
  private final HarversineUtil harversineUtil;
  private Point prevPoint, currentPoint;

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

  public DestinationDetailResponse findDestinationDetail(Integer destinationId) {

    Destination destination = destinationRepository.findById(destinationId).get();

    return DestinationDetailResponse.builder()
        .destinationId(destination.getId())
        .destinationType(destination.getType())
        .destinationName(destination.getName())
        .destinationImgUrl(destination.getImgUrl())
        .point(Point.builder()
            .latitude(destination.getLatitude())
            .longitude(destination.getLongitude())
            .build())
        .build();
  }

  public List<DestinationListResponse> findDestinationList(List<Integer> destinationsIdList) {

    List<DestinationListResponse> destinationListResponseList = new ArrayList<>();

    for (Integer id : destinationsIdList) {

      Destination destination = destinationRepository.findById(id).get();

      destinationListResponseList.add(DestinationListResponse.builder()
          .destinationId(destination.getId())
          .destinationName(destination.getName())
          .destinationContent(destination.getContent())
          .destinationImgUrl(destination.getImgUrl())
          .build());
    }

    return destinationListResponseList;
  }

  public DestinationRecommendResponse findDestinationRecommend(int cityId,
      List<Integer> friendTag) {

    HashMap<String, List<Integer>> destinationRecommendResponse = new HashMap<>();

    // 친구가 있는 경우에 대한 친구 ID를 담아서 장고 서버로 보내는 로직 필요 - 장고 서버에서 오는 데이터 그대로 반환
    List<Integer> sights = new ArrayList<>();
    List<Integer> food = new ArrayList<>();
    List<Integer> cafe = new ArrayList<>();

    sights.add(1000981);
    food.add(1004281);
    cafe.add(1005548);
    cafe.add(1019796);
    sights.add(1019843);

    destinationRecommendResponse.put("sights", sights);
    destinationRecommendResponse.put("food", food);
    destinationRecommendResponse.put("cafe", cafe);

    return DestinationRecommendResponse.builder()
        .DestinationRecommendList(destinationRecommendResponse)
        .build();
  }


}
