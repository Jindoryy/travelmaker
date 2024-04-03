package com.a305.travelmaker.domain.travel.service;

import com.a305.travelmaker.domain.city.entity.City;
import com.a305.travelmaker.domain.city.repository.CityRepository;
import com.a305.travelmaker.domain.course.dto.CourseInfo;
import com.a305.travelmaker.domain.course.entity.Course;
import com.a305.travelmaker.domain.course.repository.CourseRepository;
import com.a305.travelmaker.domain.destination.entity.Destination;
import com.a305.travelmaker.domain.destination.repository.DestinationRepository;
import com.a305.travelmaker.domain.destination.service.DestinationService;
import com.a305.travelmaker.domain.diary.entity.Diary;
import com.a305.travelmaker.domain.diary.entity.File;
import com.a305.travelmaker.domain.diary.repository.DiaryRepository;
import com.a305.travelmaker.domain.memo.entity.Memo;
import com.a305.travelmaker.domain.memo.repository.MemoRepository;
import com.a305.travelmaker.domain.travel.dto.AfterCourseResponse;
import com.a305.travelmaker.domain.travel.dto.Cluster;
import com.a305.travelmaker.domain.travel.dto.DiaryStatus;
import com.a305.travelmaker.domain.travel.dto.OnCourseResponse;
import com.a305.travelmaker.domain.travel.dto.Point;
import com.a305.travelmaker.domain.travel.dto.Spot;
import com.a305.travelmaker.domain.travel.dto.TravelInfoRequest;
import com.a305.travelmaker.domain.travel.dto.TravelInfoResponse;
import com.a305.travelmaker.domain.travel.dto.TravelListResponse;
import com.a305.travelmaker.domain.travel.dto.TravelRecommendCluster;
import com.a305.travelmaker.domain.travel.dto.TravelRequest;
import com.a305.travelmaker.domain.travel.dto.TravelResponse;
import com.a305.travelmaker.domain.travel.entity.Travel;
import com.a305.travelmaker.domain.travel.repository.TravelRepository;
import com.a305.travelmaker.domain.user.entity.User;
import com.a305.travelmaker.domain.user.repository.UserRepository;
import com.a305.travelmaker.domain.user.service.SchedulingService;
import com.a305.travelmaker.global.common.dto.DestinationDistanceResponse;
import com.a305.travelmaker.global.config.RestConfig;
import com.a305.travelmaker.global.util.FileUtil;
import com.a305.travelmaker.global.util.HarversineUtil;
import com.google.gson.Gson;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class TravelService {

  private static final int ALL_DESTINATION_COUNT = 6; // 빅데이터 서버로 부터 받아오는 Day 별로 장소의 개수
  //  private static final double DNF = Double.MAX_VALUE;
  private boolean[] visited;
  //  private double[] dist;
  private List<Spot>[] graph;
  //  private int[][] graph;
//  private double[][] dist;
  private List<Integer> shortestPath;
  private double minDistance;

  private final RestConfig restConfig;
  private final FileUtil fileUtil;
  private final DestinationService destinationService;
  private final TravelRepository travelRepository;
  private final DestinationRepository destinationRepository;
  private final HarversineUtil harversineUtil;
  private final CityRepository cityRepository;
  private final MemoRepository memoRepository;
  private final CourseRepository courseRepository;
  private final UserRepository userRepository;
  private final DiaryRepository diaryRepository;
  private final SchedulingService schedulingService;

  @Value("${cloud.aws.s3.base-url}")
  private String baseUrl;
  @Value("${bigdata.server.domain}")
  private String bigdataServerDomain;

  private List<Point> pointList = new ArrayList<>(); // 장소의 경도, 위도를 담고 있는 리스트
  private List<Cluster> clusters = new ArrayList<>();
  private List<Integer> destinationsIdList = new ArrayList<>(); // 군집내에 속해 있는 ID 리스트
  private List<List<DestinationDistanceResponse>> destinationDistanceResponses = new ArrayList<>(); // 데이터 반환 값
  private List<DestinationDistanceResponse> destinationDistanceResponse = new ArrayList<>();

  @Transactional
  public TravelResponse createTravel(TravelRequest travelRequest) {

    /*
      0. 데이터 세팅
      1. 군집화 실행 (군집 개수 ≤ 여행일 수)
      2. 빅데이터 서버에 군집별로 (센터포인트, R, id리스트) 넘겨서 군집별로 장소 ID 리스트(유저가 선택한 장소 + 빅데이터 기반 추천 장소 리스트) 받기
      - 빅데이터 서버에서 카테고리 안 겹치게 데이터 반환 해줌.
      3. 모든 장소에 대한 최적 거리 탐색 (DFS)
      4. 데이터 베이스 저장 후 응답 객체 형식에 맞춰서 데이터 반환
    */

    /*
      0. 데이터 세팅
        0-1. 이전 클러스터, 장소 리스트 초기화
        0-2. 장소 id의 경도, 위도를 pointList에 담기
        0-3. 여행일 수 확인
    */
    pointList.clear();
    clusters.clear();
    destinationDistanceResponses.clear();

    for (Integer destinationId : travelRequest.getDestinationIdList()) {

      Destination destination = destinationRepository.findById(destinationId).get();
      pointList.add(Point.builder()
          .destinationId(destination.getId())
          .latitude(destination.getLatitude())
          .longitude(destination.getLongitude())
          .build());
    }

    long travelDays = travelRequest.calculateTravelDays();

    System.out.println(pointList);
    System.out.println(travelDays);

    /*
      1. 군집화 실행 (군집 개수 ≤ 여행일 수)
        군집화 과정
        1-1. 초기 중심 무작위 선택
        1-2. 각 장소들의 경도와 위도를 기준으로 중심점과의 비교를 통해 군집화
        1-3. 새로운 중심 개선
        1-4. 2, 3번의 과정을 반복하면서 k개의 군집이 생성되면 종료 (만약 k개의 군집이 생성되지 않는다면 가장 많은 point를 가진 군집의 point를 나눠서 새로운 군집 생성)
     */
    initializeClusters(travelDays);
    System.out.println(clusters);
    boolean centroidsChanged = true;
    while (centroidsChanged) {

      assignPointsToClusters(); // 중심점을 기준으로 각 군집에 할당
      centroidsChanged = updateCentroids(); // 중심점 재계산 - 변경점이 없다면 종료
    }

    for (int i = 0; i < clusters.size(); i++) {

      System.out.println("군집 " + (i + 1) + ": " + clusters.get(i));
    }

    /*
      2. 빅데이터 서버에 군집별로 (중심점의 위도, 경도, R(가장 먼 장소의 거리), 장소 ID리스트, 유저ID)를 넘겨서 군집별로 장소 ID 리스트(유저가 선택한 장소 + 빅데이터 기반 추천 장소) 받기
        2-1. 빅데이터 서버에 데이터를 보낼 수 있도록 군집별로 데이터를 담기
     */

    Map<String, TravelRecommendCluster> travelRecommendClusterList = new HashMap<>();

    // 군집별로 중심점의 위도, 경도, 중심점과 가장 먼 장소와의 거리, 장소 ID 리스트 추출
    for (int i = 0; i < clusters.size(); i++) {

      Cluster cluster = clusters.get(i);
      double centerLatitude = cluster.getCentroid().getLatitude();
      double centerLongitude = cluster.getCentroid().getLongitude();

      List<Integer> placeIds = new ArrayList<>(); // 장소 ID 리스트
      List<Point> points = cluster.getPoints();
      for (int j = 0; j < points.size(); j++) {

        placeIds.add(points.get(j).getDestinationId());
      }

      Point centroid = cluster.getCentroid(); // 중심점
      double r = Double.MIN_VALUE;
      for (int j = 0; j < points.size(); j++) {

        Point point = points.get(j); // 장소
        double distance = harversineUtil.calculateDistance(centroid, point); // 중심점과 장소와의 거리 계산
        r = Math.max(r, distance); // 가장 먼 거리 초기화
      }

      TravelRecommendCluster travelRecommendCluster = TravelRecommendCluster.builder()
          .centerLatitude(centerLatitude)
          .centerLongitude(centerLongitude)
          .r(r)
          .placeIds(placeIds)
          .userId(1111L)
          .build();
      System.out.println("r 값은 여기 : " + r);
      travelRecommendClusterList.put(String.valueOf(i + 1), travelRecommendCluster);
    }

    // Gson을 사용하여 JSON 문자열로 변환
    Gson gson = new Gson();
    String json = gson.toJson(travelRecommendClusterList);

    // HTTP 요청 설정
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    HttpEntity<String> requestEntity = new HttpEntity<>(json, headers);

    System.out.println(travelRecommendClusterList);

    Map<String, List<Integer>> travelDaysIdList = restConfig.restTemplate()
        .postForObject(bigdataServerDomain + "/recommend/travel-list",
            requestEntity,
            HashMap.class);

    System.out.println(travelDaysIdList);

    /*
      3. 모든 장소에 대한 최적 거리 탐색 (DFS)
     */

    for (Map.Entry<String, List<Integer>> entry : travelDaysIdList.entrySet()) { // Day 마다 반복문 실행

//      graph = new int[ALL_DESTINATION_COUNT][ALL_DESTINATION_COUNT];
//      dist = new double[ALL_DESTINATION_COUNT][ALL_DESTINATION_COUNT];

      graph = new ArrayList[ALL_DESTINATION_COUNT];
      for (int i = 0; i < ALL_DESTINATION_COUNT; i++) {
        graph[i] = new ArrayList<>();
      }

      String day = entry.getKey();
      List<Integer> placeIds = entry.getValue(); // 장소 ID를 담는 리스트
      List<Point> points = new ArrayList<>(); // 장소 ID, 위도, 경도를 담은 클래스를 담는 리스트

      System.out.println(placeIds);
      System.out.println(points);

      for (Integer placeId : placeIds) {

        Destination destination = destinationRepository.findById(placeId).get();
        points.add(Point.builder()
            .destinationId(placeId)
            .latitude(destination.getLatitude())
            .longitude(destination.getLongitude())
            .build());
      }

//      for (int i = 0; i < ALL_DESTINATION_COUNT; i++) {
//        for (int j = 0; j < ALL_DESTINATION_COUNT; j++) {
//
//          if (i == j) {
//
//            dist[i][j] = 0;
//            continue;
//          }
//
//          double distance = harversineUtil.calculateDistance(points.get(i), points.get(j));
//          dist[i][j] = distance;
//        }
//      }

      for (int i = 0; i < placeIds.size() - 1; i++) {
        for (int j = i + 1; j < placeIds.size(); j++) {

          if (i != j) {

            double distance = harversineUtil.calculateDistance(points.get(i), points.get(j));

            graph[i].add(Spot.builder()
                .v(j)
                .distance(distance)
                .build());
            graph[j].add(Spot.builder()
                .v(i)
                .distance(distance)
                .build());
          }
        }
      }

      for (int i = 0; i < graph.length; i++) {
        System.out.println(graph[i]);
      }

      minDistance = Double.MAX_VALUE;
      shortestPath = new ArrayList<>();

      for (int i = 0; i < ALL_DESTINATION_COUNT; i++) {

        List<Integer> path = new ArrayList<>();
        path.add(i);
        visited = new boolean[ALL_DESTINATION_COUNT];
        visited[i] = true;
        dfs(0, i, 0, path);
        visited[i] = false;
      }

      System.out.println(shortestPath);

      /*
        5. 데이터 베이스 저장 후 응답 객체 형식에 맞춰서 데이터 반환
      */

      destinationDistanceResponse = new ArrayList<>();
      destinationsIdList.clear();
      // 각 지점의 Point, nextDestinationDistance, destinationName, destinationType, destinationImgUrl 넣기
      for (int i = 0; i < shortestPath.size(); i++) {

        destinationsIdList.add(placeIds.get(shortestPath.get(i)));
      }

      destinationDistanceResponses.add(destinationService.findDestinationDistance(
          destinationsIdList));

//      visited = new boolean[ALL_DESTINATION_COUNT];
//      dist = new double[ALL_DESTINATION_COUNT];
//      dijkstra(0);
//
//      for (int i = 0; i < ALL_DESTINATION_COUNT ; i++) {
//        if(dist[i] == Double.MAX_VALUE){
//          System.out.println("INF");
//        }else{
//          System.out.println(dist[i]);
//        }
//      }

    }

//    /*
//      5. 데이터 베이스 저장 후 응답 객체 형식에 맞춰서 데이터 반환
//     */
//    for (int i = 0; i < travelDays; i++) { // 각 군집별로 장소 ID 확인
//
//      destinationsIdList.clear();
//      for (int j = 0; j < clusters.get(i).getPoints().size(); j++) {
//
//        Integer pointId = clusters.get(i).getPoints().get(j).getDestinationId();
//        destinationsIdList.add(pointId);
//      }
//
//      destinationDistanceResponses.add(
//          destinationService.findDestinationDistance(destinationsIdList));
//    }

    return TravelResponse.builder()
        .travelList(destinationDistanceResponses)
        .build();
  }

  private void dfs(int depth, int current, double allDistance, List<Integer> path) {

    if (depth == ALL_DESTINATION_COUNT - 1) {
      // 최대 깊이에 도달하면 최단 경로 업데이트
      if (allDistance < minDistance) {
//        System.out.println(path);
        minDistance = allDistance;
        shortestPath = new ArrayList<>(path);
      }
      return;
    }

    for (Spot neighbor : graph[current]) {
      if (!visited[neighbor.getV()]) { // 아직 방문하지 않은 정점만 탐색

        visited[neighbor.getV()] = true; // 현재 정점을 방문했음을 표시
        path.add(neighbor.getV());
        dfs(depth + 1, neighbor.getV(), allDistance + neighbor.getDistance(), path);
        visited[neighbor.getV()] = false; // 탐색을 마치고 현재 정점을 다시 방문하지 않은 상태로 표시
        path.remove(path.size() - 1);
      }
    }
  }

//  private void dijkstra(int start) {
//
//    Arrays.fill(dist, DNF);
//    dist[start] = 0L;
//
//    PriorityQueue<Spot> pq = new PriorityQueue<>();
//    pq.add(new Spot(start, 0L));
//
//    while (!pq.isEmpty()) {
//
//      Spot now = pq.poll();
//
//      if (visited[now.getV()]) continue;
//      visited[now.getV()] = true;
//
//      for (Spot next : graph[now.getV()]) {
//        if (dist[next.getV()] > dist[now.getV()] + next.getDistance()) {
//
//          dist[next.getV()] = dist[now.getV()] + next.getDistance();
//          pq.add(new Spot(next.getV(), dist[next.getV()]));
//        }
//      }
//    }
//  }

  // 초기 중심 무작위 선택 (K-Means ++ Algorithm)
  private void initializeClusters(long travelDays) {

    // 첫 번째 중심점을 장소 리스트 안에서 무작위로 선택
    int index = new Random().nextInt(pointList.size());
    Point firstCentroid = pointList.get(index);
    Cluster firstCluster = new Cluster(firstCentroid);
    clusters.add(firstCluster);

    // 이미 선택된 중심점의 인덱스를 기록할 리스트 생성
    List<Integer> selectedIndexes = new ArrayList<>();
    selectedIndexes.add(index);

    // 나머지 중심점을 선택
    for (int i = 1; i < travelDays; i++) {

      // 이미 선택된 중심점과 중복되지 않도록 랜덤하게 인덱스 선택
      int newIndex;
      do {
        newIndex = new Random().nextInt(pointList.size());
      } while (selectedIndexes.contains(newIndex));

      // 선택된 중심점을 기록
      selectedIndexes.add(newIndex);

      // 새로운 중심점 추가
      Point newCentroid = pointList.get(newIndex);
      Cluster newCluster = new Cluster(newCentroid);
      clusters.add(newCluster);
    }

//    // 나머지 중심점을 선택
//    for (int i = 1; i < travelDays; i++) {
//
//      // 각 데이터 포인트에 대해 가장 먼 중심점의 거리를 계산
//      List<Double> distances = new ArrayList<>();
//      for (Point point : pointList) {
//
//        double maxDistance = Double.MIN_VALUE;
//        for (Cluster cluster : clusters) {
//
//          // 클러스터(군집)의 중심점과 현재점 과의 거리 계산
//          double distance = harversineUtil.calculateDistance(cluster.getCentroid(), point);
//          if (distance < maxDistance) {
//            maxDistance = distance;
//          }
//        }
//
//        // 클러스터(군집)의 중심점과 가장 먼 점의 거리를 추가
//        distances.add(maxDistance);
//      }
//
//      // 각 데이터 포인트를 초기 중심점 후보로 선택할 확률을 계산하여 누적 확률 리스트에 저장
//      List<Double> probabilities = new ArrayList<>();
//      double totalDistance = 0.0;
//      for (double distance : distances) {
//        totalDistance += distance;
//      }
//      double cumulativeProbability = 0.0;
//      for (double distance : distances) {
//        double probability = distance / totalDistance;
//        cumulativeProbability += probability;
//        probabilities.add(cumulativeProbability);
//      }
//
//      // 누적 확률 리스트를 사용하여 새로운 중심점을 선택
//      double randomValue = new Random().nextDouble();
//      for (int j = 0; j < probabilities.size(); j++) {
//
//        if (randomValue > probabilities.get(j)) {
//          Point newCentroid = pointList.get(j);
//          Cluster newCluster = new Cluster(newCentroid);
//          clusters.add(newCluster);
//          break;
//        }
//      }
//    }
  }

  public AfterCourseResponse findTravelBeforeDetail(Integer id) {

    Travel travel = travelRepository.findById(id).get();
    Memo memo = memoRepository.findByTravelId(travel.getId());
    City city = cityRepository.findByName(travel.getCityName());

    return AfterCourseResponse.builder()
        .travelId(travel.getId())
        .cityName(travel.getCityName())
        .imgUrl(city.getImgUrl())
        .build();
  }

  public List<TravelListResponse> findTravelList(Long userId) {

    List<TravelListResponse> travelListResponse = new ArrayList<>();

    List<Travel> travelList = travelRepository.findByUserId(userId);

    for (Travel travel : travelList) {

      City city = cityRepository.findByName(travel.getCityName());

      List<String> friendsList = new ArrayList<>();
      if (travel.getFriends() != null && !travel.getFriends().isEmpty()) {

        String friends = travel.getFriends();
        String[] friendsArray = friends.split(",");
        for (String friendId : friendsArray) {
          System.out.println(friendId);
          System.out.println(friendId.length());
          Long fId = Long.parseLong(friendId);
          User user = userRepository.findById(fId).get();
          friendsList.add(user.getNickname());
        }
      }

      Integer diaryId = null;
      if (travel.getStatus().equals(DiaryStatus.AFTER_DIARY)) {
        diaryId = travel.getDiaryList().get(0).getId();
      }

      travelListResponse.add(TravelListResponse.builder()
          .travelId(travel.getId())
          .cityName(travel.getCityName())
          .startDate(travel.getStartDate())
          .endDate(travel.getEndDate())
          .friendNameList(friendsList)
          .imgUrl(city.getImgUrl())
          .status(travel.getStatus())
          .diaryId(diaryId)
          .build());
    }

    return travelListResponse;
  }

  @Transactional
  public void removeTravel(Integer id) {

    Travel travel = travelRepository.findById(id).get();
    System.out.println(travel);
    for (Diary diary : travel.getDiaryList()) {
      for (File file : diary.getFileList()) {

        fileUtil.deleteFile(file.getImgUrl().replace(baseUrl, "")); // S3 도메인 부분 제외한 name으로 삭제
      }
    }

    schedulingService.updateUserStatusBeforeCourse(travel.getUser().getId());
    if (travel.getFriends() != null && !travel.getFriends().isEmpty()) {

      String[] friends = travel.getFriends().split(",");
      for (String friendId : friends) {
        schedulingService.updateUserStatusBeforeCourse(Long.parseLong(friendId));
      }
    }

    travelRepository.delete(travel);

    schedulingService.updateUsersBasedOnTravelDates();

  }


  private void assignPointsToClusters() { // 데이터 포인트를 가장 가까운 클러스터에 할당하는 역할

    for (Cluster cluster : clusters) {
      cluster.clearPoints();
    }

    for (Point point : pointList) {

      Cluster nearestCluster = null;
      double minDistance = Double.MAX_VALUE;
      for (Cluster cluster : clusters) {

        double distance = harversineUtil.calculateDistance(cluster.getCentroid(), point);
        if (distance < minDistance) {
          minDistance = distance;
          nearestCluster = cluster;
        }
      }
      nearestCluster.addPoint(point);
    }
  }

  private boolean updateCentroids() { // 중심점이 변경되었는지 확인

    boolean centroidsChanged = false;
    for (Cluster cluster : clusters) {

      Point oldCentroid = cluster.getCentroid();
      Point newCentroid = cluster.calculateCentroid();
      double distance = harversineUtil.calculateDistance(oldCentroid,
          newCentroid); // 이전 중심점과 새 중심점 간의 거리 계산

      if (distance > 0.001) { // 일정한 임계값보다 거리가 크게 변했는지 확인

        centroidsChanged = true;
        cluster.setCentroid(newCentroid);
      }
    }
    return centroidsChanged;
  }

  @Transactional
  public void saveTravel(Long userId, TravelInfoRequest travelInfoRequest) {

    // 해당 유저가 가진 여행 정보들 중에서 생성할려는 여행 정보와 일정이 중복되면 저장 못하게 하기
    User user = userRepository.findById(userId).get();
    boolean hasTravelInfo = travelRepository.existsByUserIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            userId, travelInfoRequest.getStartDate(), travelInfoRequest.getEndDate());
    if (hasTravelInfo) return;

    // 리스트 형태로 받아온 친구 ID를 String 형태로 바꿔서 ,로 구분해 저장
    String friends = null;
    if (travelInfoRequest.getFriendIdList() != null) {
      List<Integer> friendIdList = travelInfoRequest.getFriendIdList();
      friends = friendIdList.stream()
          .map(Object::toString)
          .collect(Collectors.joining(","));
    }

    Travel travel = Travel.builder()
        .user(user)
        .cityName(travelInfoRequest.getCityName())
        .startDate(travelInfoRequest.getStartDate())
        .endDate(travelInfoRequest.getEndDate())
        .friends(friends)
        .transportation(travelInfoRequest.getTransportation())
        .status(DiaryStatus.BEFORE_DIARY)
        .build();
    System.out.println(travel);
    travelRepository.save(travel);

    // 여행 저장하면 코스 데이터는 무조건 생성.
    // 오늘 날짜 구하기
    LocalDate today = LocalDate.now();

    long travelDays = travelInfoRequest.calculateTravelDays();
    for (int i = 0; i < travelDays; i++) {

      List<Integer> courselist = travelInfoRequest.getCourseList().get(i);
      String courses = courselist.stream()
          .map(Object::toString)
          .collect(Collectors.joining(","));

      courseRepository.save(
          Course.builder()
              .travel(travel)
              .destinationList(courses)
              .startDate(today.plusDays(i))
              .build()
      );
    }

    schedulingService.updateUsersBasedOnTravelDates();
  }

  public OnCourseResponse findTravelAfterDetail(Integer id) {

    Travel travel = travelRepository.findById(id).get();

    List<CourseInfo> courseInfoList = new ArrayList<>();
    List<Course> courseList = travel.getCourseList();

    // 오늘 날짜 구하기
    LocalDate today = LocalDate.now();

    for (Course course : courseList) {

      // 코스의 시작 날짜 가져오기
      LocalDate startDate = course.getStartDate();

      // 오늘 날짜인 경우
      if (startDate.isEqual(today)) {

        String[] destinationList = course.getDestinationList().split(",");

        for (String destinationId : destinationList) {

          Integer dId = Integer.parseInt(destinationId);
          Destination destination = destinationRepository.findById(dId).get();

          courseInfoList.add(CourseInfo.builder()
              .destinationName(destination.getName())
              .destinationImgUrl(destination.getImgUrl())
              .build());
        }
      }
    }

    return OnCourseResponse.builder()
        .cityName(travel.getCityName())
        .startDate(travel.getStartDate())
        .courseInfoList(courseInfoList)
        .build();
  }

//  public boolean checkUserDiaryStatus(Long userId) {
//    LocalDate today = LocalDate.now();
//    LocalDate weekAgo = today.minusWeeks(1);
//
//    // 오늘 기준으로 일주일 전까지 탐색 유무만 체크하면 되므로 count
//    long count = travelRepository.countByUserIdAndStatusAndEndDateBetween(
//        userId, DiaryStatus.BEFORE_DIARY, today, weekAgo);
//
//    return count > 0;
//  }

  public TravelInfoResponse findTravelInfo(Integer id) {

    Travel travel = travelRepository.findById(id).get();

    destinationDistanceResponses = new ArrayList<>();

//    long travelDays = ChronoUnit.DAYS.between(travel.getStartDate(), travel.getEndDate()) + 1;

    List<Course> courseList = travel.getCourseList();

    for (Course course : courseList) {

      destinationsIdList = new ArrayList<>();
      String[] destinationList = course.getDestinationList().split(",");
      for (String dId : destinationList) {
        if (!dId.isEmpty()) { // 빈 문자열인지 확인
          destinationsIdList.add(Integer.parseInt(dId));
        }
      }

      destinationDistanceResponses.add(destinationService.findDestinationDistance(
          destinationsIdList));
    }

    return TravelInfoResponse.builder()
        .cityName(travel.getCityName())
        .startDate(travel.getStartDate())
        .endDate(travel.getEndDate())
        .transportation(travel.getTransportation())
        .travelList(destinationDistanceResponses)
        .build();
  }
}