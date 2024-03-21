package com.a305.travelmaker.domain.destination.service;

import com.a305.travelmaker.domain.destination.dto.DestinationDetailResponse;
import com.a305.travelmaker.domain.destination.dto.DestinationListResponse;
import com.a305.travelmaker.domain.destination.entity.Destination;
import com.a305.travelmaker.domain.destination.repository.DestinationRepository;
import com.a305.travelmaker.domain.travel.dto.Point;
import com.a305.travelmaker.global.common.dto.DestinationDistanceResponse;
import com.a305.travelmaker.global.util.HarversineUtil;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DestinationService {

  private static final int PAGE_DESTINATION_COUNT = 10;
  private final DestinationRepository destinationRepository;
  private final HarversineUtil harversineUtil;
  private Point prevPoint, currentPoint;

  @Transactional
  public List<DestinationDistanceResponse> findDestinationDistance(List<Integer> destinationsIdList) {

    // 장소 ID 리스트를 0 ~ N-1까지 반복문을 돌면서 하버사인 공식을 이용하여 거리 계산 후 DTO에 담아 반환
    List<DestinationDistanceResponse> destinationDistanceResponses = new ArrayList<>();

    prevPoint = null;
    for (Integer destinationId : destinationsIdList) {

      Destination destination = destinationRepository.findById(destinationId).orElse(null);
      if (destination == null) continue;

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

  public Page<DestinationListResponse> findDestinationList(Integer page) {

    PageRequest pageRequest = PageRequest.of(page, PAGE_DESTINATION_COUNT);

    return destinationRepository.findAll(pageRequest)
        .map(destination -> DestinationListResponse.builder()
            .destinationId(destination.getId())
            .destinationName(destination.getName())
            .destinationContent(destination.getContent())
            .destinationImgUrl(destination.getImgUrl())
            .build());
  }
}
