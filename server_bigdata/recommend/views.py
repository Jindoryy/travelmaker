from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

import random
import pandas as pd
import numpy as np
from collections import Counter
from collections import defaultdict
from itertools import combinations
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
from surprise import Dataset, Reader, KNNBasic, SVD
from surprise.model_selection import train_test_split
from surprise.accuracy import rmse

from recommend.models import Destination,Likes
from recommend.serializers import DestinationSerializer,LikeSerializer


########################################## 좋아요 기반 추천 ##########################################
@api_view(['POST'])
def getTravelList(request):
    # 요청의 본문에서 JSON 형식의 데이터 가져오기
    data_from_body = request.data
    print(data_from_body)
    print("latitude 값:", data_from_body['center_coordinates']['latitude'])
    print("location_ids 값:", data_from_body['location_ids'])

    # 여기서 데이터 처리를 수행하고 원하는 응답을 반환
    # 예를 들어, 받은 데이터를 가공하여 응답으로 반환
    processed_data = {}  # 데이터 가공 예시 (실제로는 여기에서 데이터 처리를 수행해야 합니다.)

    return Response(processed_data)


########################################## 좋아요 기반 추천 ##########################################
# TF-IDF를 사용하여 특성 텍스트를 벡터화하고, 사용자의 특성을 기반으로 코사인 유사도를 계산하여 유사한 장소를 추천합니다.
# 그나마 비슷한 애들로 추천 + 목록 골고루 섞기
@api_view(['GET'])
def getLikeCbfList(request, user_id):
    # 사용자가 좋아요를 누른 장소의 특성을 가져오기
    user_likes = Likes.objects.filter(USER_ID=user_id, FLAG=True)
    user_features = []
    for like in user_likes:
        destination = Destination.objects.filter(DESTINATION_ID=like.DESTINATION_ID).first()
        if destination:
            user_features.extend(destination.FEATURE.split(','))

    # 각 특성의 빈도 계산
    feature_counter = Counter(user_features)

    # 가장 많이 등장한 특성 추출 (최대 10개까지)
    top_features = [feature for feature, _ in feature_counter.most_common(10)]

    # 가장 많이 등장한 특성들을 가지고 있는 장소 찾기
    similar_destinations = []
    for feature in top_features:
        destinations_with_feature = Destination.objects.filter(FEATURE__contains=feature)
        similar_destinations.extend(destinations_with_feature)

    # 중복 제거
    similar_destinations = list(set(similar_destinations))

    # 유사한 장소 중 사용자가 이미 좋아요를 누른 장소 제외
    user_liked_destination_ids = [like.DESTINATION_ID for like in user_likes]
    similar_destinations = [destination for destination in similar_destinations if destination.DESTINATION_ID not in user_liked_destination_ids]

    # 최대한 비슷한 장소로 30개를 채워주기
    if len(similar_destinations) < 100:
        remaining_recommendations = 100 - len(similar_destinations)
        # 비슷한 장소를 추가로 찾아서 추천 목록에 추가
        more_similar_destinations = Destination.objects.exclude(DESTINATION_ID__in=user_liked_destination_ids).exclude(pk__in=[d.pk for d in similar_destinations])[:remaining_recommendations]
        similar_destinations.extend(more_similar_destinations)
    
    # TF-IDF 벡터화
    tfidf_vectorizer = TfidfVectorizer()
    feature_texts = [' '.join(destination.FEATURE.split(',')) for destination in similar_destinations]
    tfidf_matrix = tfidf_vectorizer.fit_transform(feature_texts)

    # 코사인 유사도 계산
    user_feature_text = ' '.join(user_features)
    user_tfidf = tfidf_vectorizer.transform([user_feature_text])
    similarities = cosine_similarity(user_tfidf, tfidf_matrix).flatten()
    
    # 유사도에 따라 장소 정렬
    similar_destinations = [similar_destinations[i] for i in similarities.argsort()[::-1]]

    # 목록을 무작위로 섞기
    random.shuffle(similar_destinations)

    # 추천 결과에서 DESTINATION_ID만 추출하여 리스트에 담기
    destination_ids = [destination.DESTINATION_ID for destination in similar_destinations]

    # 500개의 장소로 제한
    destination_ids = destination_ids[:500]

    return Response(destination_ids, status=status.HTTP_200_OK)


# 그나마 비슷한 애들로 추천 + 목록 골고루 섞기
@api_view(['GET'])
def getLikeCbfDetail(request, user_id):
    # 사용자가 좋아요를 누른 장소의 특성을 가져오기
    user_likes = Likes.objects.filter(USER_ID=user_id, FLAG=True)
    user_features = []
    for like in user_likes:
        destination = Destination.objects.filter(DESTINATION_ID=like.DESTINATION_ID).first()
        if destination:
            user_features.extend(destination.FEATURE.split(','))

    # 각 특성의 빈도 계산
    feature_counter = Counter(user_features)

    # 가장 많이 등장한 특성 추출 (최대 10개까지)
    top_features = [feature for feature, _ in feature_counter.most_common(10)]

    # 가장 많이 등장한 특성들을 가지고 있는 장소 찾기
    similar_destinations = []
    for feature in top_features:
        destinations_with_feature = Destination.objects.filter(FEATURE__contains=feature)
        similar_destinations.extend(destinations_with_feature)

    # 중복 제거
    similar_destinations = list(set(similar_destinations))

    # 유사한 장소 중 사용자가 이미 좋아요를 누른 장소 제외
    user_liked_destination_ids = [like.DESTINATION_ID for like in user_likes]
    similar_destinations = [destination for destination in similar_destinations if destination.DESTINATION_ID not in user_liked_destination_ids]

    # 최대한 비슷한 장소로 30개를 채워주기
    if len(similar_destinations) < 100:
        remaining_recommendations = 100 - len(similar_destinations)
        # 비슷한 장소를 추가로 찾아서 추천 목록에 추가
        more_similar_destinations = Destination.objects.exclude(DESTINATION_ID__in=user_liked_destination_ids).exclude(pk__in=[d.pk for d in similar_destinations])[:remaining_recommendations]
        similar_destinations.extend(more_similar_destinations)
    
    # TF-IDF 벡터화
    tfidf_vectorizer = TfidfVectorizer()
    feature_texts = [' '.join(destination.FEATURE.split(',')) for destination in similar_destinations]
    tfidf_matrix = tfidf_vectorizer.fit_transform(feature_texts)

    # 코사인 유사도 계산
    user_feature_text = ' '.join(user_features)
    user_tfidf = tfidf_vectorizer.transform([user_feature_text])
    similarities = cosine_similarity(user_tfidf, tfidf_matrix).flatten()
    
    # 유사도에 따라 장소 정렬
    similar_destinations = [similar_destinations[i] for i in similarities.argsort()[::-1]]

    # 목록을 무작위로 섞기
    random.shuffle(similar_destinations)

    # 추천 결과를 직렬화 (500개)
    # serializer = DestinationSerializer(similar_destinations, many=True)
    serializer = DestinationSerializer(similar_destinations[:500], many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)



########################################## 더미데이터 ##########################################

@api_view(['GET'])
def getLike(request, user_id):
    if not Likes.objects.filter(USER_ID=user_id).exists():
        return Response({"message": "아이디없음"})
    
    # 유저가 like를 누른 목록을 가져옵니다.
    user_likes = Likes.objects.filter(USER_ID=user_id, FLAG=True)
    like_serializer = LikeSerializer(user_likes, many=True)
    return Response(like_serializer.data)

@api_view(['GET'])
def getDestination(request):
    destination = Destination.objects.all()
    destination_serializer = DestinationSerializer(destination, many=True)
    destination_df = pd.DataFrame(list(destination.values()))
    print(destination_df.head())
    return Response(destination_serializer.data)


########################################## 이전 #################################################
# # feature 개수 세서 top3
# @api_view(['GET'])
# def getLike(request, user_id):
#     # user_id에 해당하는 사용자가 있는지 확인
#     if not Like.objects.filter(USER_ID=user_id).exists():
#         return Response({"message": "아이디없음"})

#     # flag가 true인 애들만 가져오기
#     like = Like.objects.filter(FLAG=True, USER_ID=user_id)
#     like_df = pd.DataFrame(list(like.values()))
    
#     # 모든 FEATURE 값을 합치기하고 앞뒤 공백을 제거
#     all_features = [feature.strip() for feature in ','.join(like_df['FEATURE'].tolist()).split(',')]
    
#     # 각 FEATURE의 등장 횟수를 계산
#     feature_counts = Counter(all_features)

#     # 가장 많이 등장하는 3개의 FEATURE 찾기
#     most_common_features = feature_counts.most_common(3)
    
#     # 결과를 출력 형식에 맞게 변환 (top3 나열만, 나열+갯수)
#     most_common_features_formatted = [feature[0] for feature in most_common_features]
    
#     # 직렬화하여 기존 데이터와 함께 반환
#     like_serializer = LikeSerializer(like, many=True)
    
#     # 가장 많이 등장하는 3개의 FEATURE와 함께 응답 반환
#     return Response({
#         "features":most_common_features_formatted,
#         "most_common_features": [f"{feature[0]}-{feature[1]}" for feature in most_common_features],
#         "likes": like_serializer.data,
#     })


######################################## 원-핫 인코딩 ###################################
################################# cf:surprise 사용 ######################################
# @api_view(['GET'])
# def recommend_destinations(request, user_id):
#     try:
#         if not Like.objects.filter(USER_ID=user_id).exists():
#             return Response({"message": "사용자가 좋아하는 항목이 없습니다."})

#         like = Like.objects.filter(FLAG=True, USER_ID=user_id)
#         like_values = list(like.values_list('DESTINATION_ID', 'FEATURE'))

#         all_features = [feature.strip() for _, features in like_values for feature in features.split(',')]
#         feature_counts = Counter(all_features)
#         top_3_features = [feature[0] for feature in feature_counts.most_common(3)]

#         liked_items = [(item[0], item[1]) for item in like_values]

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

#         # 모든 가능한 조합 생성
#         feature_combinations = []
#         for r in range(len(top_3_features), 0, -1):
#             feature_combinations += list(combinations(top_3_features, r))

#         # 사용자가 선호하는 상위 특성에 따라 목적지 필터링
#         filtered_destinations = []
#         for dest, features in zip(destinations, destination_features):
#             for combination in feature_combinations:
#                 if all(feature in features for feature in combination):
#                     filtered_destinations.append(dest)
#                     break

#         # 사용자-목적지 평가 행렬 구축
#         reader = Reader(rating_scale=(1, 5))
#         data = [(user_id, dest_id, 5) for dest_id, _ in liked_items]
#         dataset = Dataset.load_from_df(pd.DataFrame(data, columns=['user_id', 'item_id', 'rating']), reader)
        
#         trainset = dataset.build_full_trainset()

#         # KNNBasic 모델 학습
#         sim_options = {
#             'name': 'cosine',
#             'user_based': False
#         }
#         algo = KNNBasic(sim_options=sim_options)
#         algo.fit(trainset)

#         # 추천 목록 생성
#         recommendations = []
#         for dest in filtered_destinations:
#             if dest.DESTINATION_ID not in [item[0] for item in liked_items]:
#                 prediction = algo.predict(user_id, dest.DESTINATION_ID)
#                 recommendations.append((dest, prediction.est))

#         # 점수에 따라 내림차순 정렬
#         recommendations.sort(key=lambda x: x[1], reverse=True)

#         # 최종 추천 목록에 추가
#         recommended_destinations = [dest for dest, _ in recommendations[:20]]

#         serializer = DestinationSerializer(recommended_destinations, many=True)
#         return Response(serializer.data)
    
#     except Like.DoesNotExist:
#         return Response({"message": "사용자가 좋아하는 항목이 없습니다."})