from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

import pandas as pd
import numpy as np
from collections import Counter
from collections import defaultdict
from itertools import combinations
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MultiLabelBinarizer
from surprise import Dataset, Reader, KNNBasic

from recommend.models import Destination,Like
from recommend.serializers import DestinationSerializer,LikeSerializer

@api_view(['GET'])
def getDestination(request):
    destination = Destination.objects.all()
    destination_serializer = DestinationSerializer(destination, many=True)
    destination_df = pd.DataFrame(list(destination.values()))
    print(destination_df.head())
    return Response(destination_serializer.data)

# feature 개수 세서 top3
@api_view(['GET'])
def getLike(request, user_id):
    # user_id에 해당하는 사용자가 있는지 확인
    if not Like.objects.filter(USER_ID=user_id).exists():
        return Response({"message": "아이디없음"})

    # flag가 true인 애들만 가져오기
    like = Like.objects.filter(FLAG=True, USER_ID=user_id)
    like_df = pd.DataFrame(list(like.values()))
    
    # 모든 FEATURE 값을 합치기하고 앞뒤 공백을 제거
    all_features = [feature.strip() for feature in ','.join(like_df['FEATURE'].tolist()).split(',')]
    
    # 각 FEATURE의 등장 횟수를 계산
    feature_counts = Counter(all_features)

    # 가장 많이 등장하는 3개의 FEATURE 찾기
    most_common_features = feature_counts.most_common(3)
    
    # 결과를 출력 형식에 맞게 변환 (top3 나열만, 나열+갯수)
    most_common_features_formatted = [feature[0] for feature in most_common_features]
    
    # 직렬화하여 기존 데이터와 함께 반환
    like_serializer = LikeSerializer(like, many=True)
    
    # 가장 많이 등장하는 3개의 FEATURE와 함께 응답 반환
    return Response({
        "features":most_common_features_formatted,
        "most_common_features": [f"{feature[0]}-{feature[1]}" for feature in most_common_features],
        "likes": like_serializer.data,
    })


######################################## 원-핫 인코딩 ###############################################
# @api_view(['GET'])
# def recommend_destinations(request, user_id):
#     try:
#         # user_id에 해당하는 사용자가 있는지 확인
#         if not Like.objects.filter(USER_ID=user_id).exists():
#             return Response({"message": "사용자가 좋아하는 항목이 없습니다."})

#         # flag가 true인 애들만 가져오기
#         like = Like.objects.filter(FLAG=True, USER_ID=user_id)
#         like_df = pd.DataFrame(list(like.values()))
        
#         # 모든 FEATURE 값을 합치기하고 앞뒤 공백을 제거하여 리스트로 변환
#         all_features = [feature.strip() for feature in ','.join(like_df['FEATURE'].tolist()).split(',')]
        
#         # 각 FEATURE의 등장 횟수를 계산하여 가장 많이 등장하는 3개의 FEATURE 찾기
#         feature_counts = Counter(all_features)
#         top_3_features = [feature[0] for feature in feature_counts.most_common(3)]

#         # 사용자가 좋아하는 항목 가져오기
#         liked_items = Like.objects.filter(FLAG=True, USER_ID=user_id).values_list('DESTINATION_ID', flat=True)
        
#         # 모든 목적지 가져오기
#         destinations = Destination.objects.all()
        
#         # 목적지의 특성 데이터 가져오기
#         feature_lists = [dest.FEATURE.split(',') for dest in destinations]
        
#         # MultiLabelBinarizer를 사용하여 원-핫 인코딩 수행
#         mlb = MultiLabelBinarizer()
#         feature_matrix = mlb.fit_transform(feature_lists)
        
#         # 유사도 행렬 계산
#         similarity_matrix = cosine_similarity(feature_matrix)

#         # 추천할 항목 초기화
#         recommended_items = []
        
#         # 사용자가 좋아하는 항목과 유사도가 높은 항목 추천
#         for liked_item in liked_items:
#             # 사용자가 좋아하는 항목과 유사도가 높은 항목 추출
#             similar_destinations = np.argsort(similarity_matrix[liked_item - 1])[:-6:-1]
#             for destination_idx in similar_destinations:
#                 destination_id = destination_idx + 1  # 목적지 ID는 1부터 시작
#                 # 해당 목적지의 특성 가져오기
#                 destination_features = destinations[destination_id - 1].FEATURE.split(',')
                
#                 # 목적지의 특성과 사용자가 좋아하는 특성의 공통점 찾기
#                 common_features = set(destination_features) & set(top_3_features)
                
#                 if common_features and destination_id not in liked_items and destination_id not in recommended_items:
#                     recommended_items.append(destination_id)
#                     if len(recommended_items) >= 20:  # 최소 20개의 추천이 있으면 종료
#                         break
#             if len(recommended_items) >= 20:  # 최소 20개의 추천이 있으면 종료
#                 break
        
#         # 추천할 항목의 정보 가져오기
#         recommended_destinations = []
#         for item in recommended_items:
#             try:
#                 recommended_destination = Destination.objects.get(DESTINATION_ID=item)
#                 recommended_destinations.append(recommended_destination)
#             except Destination.DoesNotExist:
#                 pass
        
#         recommended_destinations_serializer = DestinationSerializer(recommended_destinations, many=True)
        
#         return Response(recommended_destinations_serializer.data)
    
#     except Like.DoesNotExist:
#         return Response({"message": "사용자가 좋아하는 항목이 없습니다."})


######################################## 유사도 없이 ###############################################
# @api_view(['GET'])
# def recommend_destinations(request, user_id):
#     try:
#         if not Like.objects.filter(USER_ID=user_id).exists():
#             return Response({"message": "사용자가 좋아하는 항목이 없습니다."})

#         like = Like.objects.filter(FLAG=True, USER_ID=user_id)
#         like_df = pd.DataFrame(list(like.values()))

#         all_features = [feature.strip() for feature in ','.join(like_df['FEATURE'].tolist()).split(',')]
#         feature_counts = Counter(all_features)
#         top_3_features = [feature[0] for feature in feature_counts.most_common(3)]

#         liked_items = Like.objects.filter(FLAG=True, USER_ID=user_id).values_list('DESTINATION_ID', flat=True)

#         destinations = Destination.objects.all()

#         # 목적지별 점수 계산을 위한 딕셔너리 초기화
#         destination_scores = {}

#         for destination in destinations:
#             destination_features = destination.FEATURE.split(',')
#             score = 0
            
#             # 상위 3개의 선호 특성에 대해 목적지의 특성이 일치하는지 확인하고 점수를 부여
#             for rank, feature in enumerate(top_3_features, start=1):
#                 if feature in destination_features:
#                     # 선호도가 높을수록 더 높은 점수를 부여
#                     score += (4 - rank)  # 1등은 3점, 2등은 2점, 3등은 1점

#             # 이미 좋아하는 항목이라면 점수에서 제외
#             if destination.DESTINATION_ID in liked_items:
#                 continue

#             destination_scores[destination] = score

#         # 점수에 따라 내림차순 정렬
#         sorted_destinations = sorted(destination_scores.items(), key=lambda item: item[1], reverse=True)

#         # 최상위 점수를 받은 목적지들을 추천 목록으로 선정
#         recommended_destinations = [dest for dest, _ in sorted_destinations[:20]]

#         # 모든 가능한 조합 생성
#         feature_combinations = []
#         for r in range(len(top_3_features), 0, -1):
#             feature_combinations += list(combinations(top_3_features, r))

#         # 추천 목록 재정렬을 위한 임시 리스트
#         temp_recommendations = []

#         for combination in feature_combinations:
#             for destination in recommended_destinations:
#                 destination_features = set(destination.FEATURE.split(','))
#                 if all(feature in destination_features for feature in combination):
#                     temp_recommendations.append(destination)
#             if len(temp_recommendations) >= 20:
#                 break

#         # 중복된 결과 제거
#         temp_recommendations = list(set(temp_recommendations))

#         # 점수에 따라 내림차순 정렬
#         temp_recommendations = sorted(temp_recommendations, key=lambda dest: destination_scores[dest], reverse=True)

#         # 최종 추천 목록에 추가
#         recommended_destinations = temp_recommendations[:20]
#         # recommended_destinations = temp_recommendations

#         # 만약 목적지가 20개가 되지 않았다면, 남은 목적지를 최종 추천 목록에 추가
#         while len(recommended_destinations) < 20:
#             for destination, _ in sorted_destinations:
#                 if destination not in recommended_destinations:
#                     recommended_destinations.append(destination)
#                 if len(recommended_destinations) == 20:
#                     break

#         serializer = DestinationSerializer(recommended_destinations, many=True)
        
#         return Response(serializer.data)
    
#     except Like.DoesNotExist:
#         return Response({"message": "사용자가 좋아하는 항목이 없습니다."})


################################# 코사인 유사도 사용 ######################################
# @api_view(['GET'])
# def recommend_destinations(request, user_id):
#     try:
#         if not Like.objects.filter(USER_ID=user_id).exists():
#             return Response({"message": "사용자가 좋아하는 항목이 없습니다."})

#         like = Like.objects.filter(FLAG=True, USER_ID=user_id)
#         like_values = list(like.values_list('FEATURE', flat=True))

#         all_features = [feature.strip() for like_value in like_values for feature in like_value.split(',')]
#         feature_counts = Counter(all_features)
#         top_3_features = [feature[0] for feature in feature_counts.most_common(3)]

#         liked_items = list(Like.objects.filter(FLAG=True, USER_ID=user_id).values_list('DESTINATION_ID', flat=True))

#         destinations = Destination.objects.all()
#         destination_features = [destination.FEATURE.split(',') for destination in destinations]
        
#         destination_feature_array = []
#         destination_scores = {}

#         for dest_features, destination in zip(destination_features, destinations):
#             dest_feature_vector = [1 if feature in dest_features else 0 for feature in top_3_features]
#             score = 0
#             for rank, feature in enumerate(top_3_features, start=1):
#                 if feature in dest_features:
#                     score += (4 - rank)
#             destination_scores[destination] = score
#             destination_feature_array.append(dest_feature_vector)

#         destination_feature_array = np.array(destination_feature_array)
#         user_feature_vector = np.array([1 if feature in all_features else 0 for feature in top_3_features]).reshape(1, -1)
        
#         # 코사인 유사도 계산
#         similarities = cosine_similarity(destination_feature_array, user_feature_vector)

#         # 점수 계산 및 이미 좋아하는 항목 제외
#         scores = [(dest, score) for dest, score in zip(destinations, similarities.flatten()) if dest.DESTINATION_ID not in liked_items]

#         # 점수에 따라 내림차순 정렬
#         scores.sort(key=lambda x: x[1], reverse=True)

#         # 추천 목록 생성
#         recommended_destinations = [dest for dest, _ in scores[:20]]

#         # 모든 가능한 조합 생성
#         feature_combinations = []
#         for r in range(len(top_3_features), 0, -1):
#             feature_combinations += list(combinations(top_3_features, r))

#         # 추천 목록 재정렬을 위한 임시 리스트
#         temp_recommendations = []

#         for combination in feature_combinations:
#             for destination in recommended_destinations:
#                 destination_features = set(destination.FEATURE.split(','))
#                 if all(feature in destination_features for feature in combination):
#                     temp_recommendations.append(destination)
#             if len(temp_recommendations) >= 20:
#                 break

#         # 중복된 결과 제거
#         temp_recommendations = list(set(temp_recommendations))

#         # 점수에 따라 내림차순 정렬
#         temp_recommendations = sorted(temp_recommendations, key=lambda dest: destination_scores[dest], reverse=True)

#         # 최종 추천 목록에 추가
#         recommended_destinations = temp_recommendations[:20]

#         # 만약 목적지가 20개가 되지 않았다면, 남은 목적지를 최종 추천 목록에 추가
#         while len(recommended_destinations) < 20:
#             for destination, _ in scores:
#                 if destination not in recommended_destinations:
#                     recommended_destinations.append(destination)
#                 if len(recommended_destinations) == 20:
#                     break

#         serializer = DestinationSerializer(recommended_destinations, many=True)
        
#         return Response(serializer.data)
    
#     except Like.DoesNotExist:
#         return Response({"message": "사용자가 좋아하는 항목이 없습니다."})


################################# cf:surprise 사용 ######################################
@api_view(['GET'])
def recommend_destinations(request, user_id):
    try:
        if not Like.objects.filter(USER_ID=user_id).exists():
            return Response({"message": "사용자가 좋아하는 항목이 없습니다."})

        like = Like.objects.filter(FLAG=True, USER_ID=user_id)
        like_values = list(like.values_list('DESTINATION_ID', 'FEATURE'))

        all_features = [feature.strip() for _, features in like_values for feature in features.split(',')]
        feature_counts = Counter(all_features)
        top_3_features = [feature[0] for feature in feature_counts.most_common(3)]

        liked_items = [(item[0], item[1]) for item in like_values]

        destinations = Destination.objects.all()
        destination_features = [destination.FEATURE.split(',') for destination in destinations]

        destination_feature_array = []
        destination_scores = {}

        for dest_features, destination in zip(destination_features, destinations):
            dest_feature_vector = [1 if feature in dest_features else 0 for feature in top_3_features]
            score = 0
            for rank, feature in enumerate(top_3_features, start=1):
                if feature in dest_features:
                    score += (4 - rank)
            destination_scores[destination] = score
            destination_feature_array.append(dest_feature_vector)

        destination_feature_array = np.array(destination_feature_array)

        # 모든 가능한 조합 생성
        feature_combinations = []
        for r in range(len(top_3_features), 0, -1):
            feature_combinations += list(combinations(top_3_features, r))

        # 사용자가 선호하는 상위 특성에 따라 목적지 필터링
        filtered_destinations = []
        for dest, features in zip(destinations, destination_features):
            for combination in feature_combinations:
                if all(feature in features for feature in combination):
                    filtered_destinations.append(dest)
                    break

        # 사용자-목적지 평가 행렬 구축
        reader = Reader(rating_scale=(1, 5))
        data = [(user_id, dest_id, 5) for dest_id, _ in liked_items]
        dataset = Dataset.load_from_df(pd.DataFrame(data, columns=['user_id', 'item_id', 'rating']), reader)
        
        trainset = dataset.build_full_trainset()

        # KNNBasic 모델 학습
        sim_options = {
            'name': 'cosine',
            'user_based': False
        }
        algo = KNNBasic(sim_options=sim_options)
        algo.fit(trainset)

        # 추천 목록 생성
        recommendations = []
        for dest in filtered_destinations:
            if dest.DESTINATION_ID not in [item[0] for item in liked_items]:
                prediction = algo.predict(user_id, dest.DESTINATION_ID)
                recommendations.append((dest, prediction.est))

        # 점수에 따라 내림차순 정렬
        recommendations.sort(key=lambda x: x[1], reverse=True)

        # 최종 추천 목록에 추가
        recommended_destinations = [dest for dest, _ in recommendations[:20]]

        serializer = DestinationSerializer(recommended_destinations, many=True)
        return Response(serializer.data)
    
    except Like.DoesNotExist:
        return Response({"message": "사용자가 좋아하는 항목이 없습니다."})