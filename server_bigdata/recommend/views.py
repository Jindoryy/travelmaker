from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from recommend.models import User,Destination,Likes
from recommend.serializers import UserSerializer,DestinationSerializer,LikeSerializer

import random
import pandas as pd
import numpy as np
from collections import Counter
from collections import defaultdict
from datetime import datetime, timedelta
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from surprise import Dataset, Reader, KNNBasic, KNNWithMeans
from surprise.model_selection import train_test_split



######################################## 성별, 나이 기반(4) + 좋아요(96) ########################################
# 또래추천 4개 => 기존에 붙여서 출력 => 반환값 다시 생각. {또래추천: {}, 기본: {}} 이런 느낌으로 가자
@api_view(['GET'])
def getMainList(request, user_id):
    # 요청으로부터 사용자 정보 가져오기
    user = User.objects.get(USER_ID=user_id)
    
    # 사용자의 성별과 나이 정보 가져오기
    user_gender = user.GENDER
    user_age = user.calculate_age()  # calculate_age 함수는 생년월일로부터 나이를 계산하는 것으로 가정
    
    # 모든 사용자의 좋아요 정보 가져오기
    all_users_likes = Likes.objects.filter(FLAG=True).values('USER_ID', 'DESTINATION_ID')

    # 좋아요 데이터프레임 생성
    likes_df = pd.DataFrame(list(all_users_likes))

    # 사용자의 성별과 나이 정보를 기반으로 한 사용자 필터링
    similar_users = User.objects.filter(GENDER=user_gender).exclude(USER_ID=user_id)
    similar_users = similar_users.filter(BIRTH__gte=user.BIRTH - timedelta(days=365*5), BIRTH__lte=user.BIRTH + timedelta(days=365*5))


    # 유사한 사용자들이 좋아요를 누른 장소들의 빈도수를 계산
    similar_likes = likes_df[likes_df['USER_ID'].isin([u.USER_ID for u in similar_users])]
    similar_likes_count = similar_likes.groupby('DESTINATION_ID').size().reset_index(name='count')

    # 유사한 사용자들이 가장 많이 누른 장소 추출
    top_destinations = similar_likes_count.sort_values(by='count', ascending=False).head(4)
    print(top_destinations)
    
    top_destination_ids = top_destinations['DESTINATION_ID'].tolist()
    
    return Response(top_destination_ids)



######################################## 시 내의 사용자 추천 장소 리스트 ########################################
@api_view(['POST'])
def getCityList(request):
    # 요청에서 데이터 추출
    user_id = request.data.get("userId")
    city_id = request.data.get("cityId")

    # 결과를 저장할 딕셔너리 초기화
    result = defaultdict(list)

    # cityId와 provinceId에 맞는 모든 장소 가져오기
    similar_destinations = Destination.objects.filter(CITY_ID=city_id)

    # 중복 제거
    similar_destinations = list(set(similar_destinations))

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

    # TF-IDF를 위한 텍스트 데이터 변환
    feature_texts = [destination.FEATURE for destination in similar_destinations]

    # TF-IDF 벡터화
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(feature_texts)

    # 특성별 TF-IDF 가중치 계산
    feature_names = vectorizer.get_feature_names_out()
    feature_tfidf = dict(zip(feature_names, tfidf_matrix.sum(axis=0).tolist()[0]))

    # 각 타입별로 장소 분류
    type_mapping = {'sights': 'sights', 'food': 'food', 'cafe': 'cafe'}
    for destination in similar_destinations:
        destination_type = destination.TYPE
        if destination_type in type_mapping:
            feature_importance = sum(feature_tfidf[feature] for feature in destination.FEATURE.split(',') if feature in feature_tfidf)
            result[type_mapping[destination_type]].append((destination.DESTINATION_ID, feature_importance))

    # 각 타입별로 중요도 순으로 정렬
    for type_id in result:
        result[type_id].sort(key=lambda x: x[1], reverse=True)
        result[type_id] = [item[0] for item in result[type_id][:33]]

    return Response(result, status=status.HTTP_200_OK)



########################################## 군집화 후 장소추천 알고리즘 ##########################################
@api_view(['POST'])
def getTravelList(request):
    # 요청에서 데이터 추출
    request_data = request.data

    # 결과를 저장할 리스트 초기화
    all_destination_ids = []

    # 각 요청 객체에 대해 처리
    for data in request_data:
        center_latitude = data.get('centerLatitude')
        center_longitude = data.get('centerLongitude')
        r = data.get('r')
        place_ids = data.get('placeIds')
        user_id = data.get('userId')

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

        # 유사한 장소 중 범위 내에 있는 장소만 선택
        lat_range = (center_latitude - 0.00904371733 * r, center_latitude + 0.00904371733 * r)
        lon_range = (center_longitude - 0.01112000 * r, center_longitude + 0.01112000 * r)
        similar_destinations = [destination for destination in similar_destinations
                                if lat_range[0] <= destination.LATITUDE <= lat_range[1]
                                and lon_range[0] <= destination.LONGITUDE <= lon_range[1]]

        # 유사한 장소 중 사용자가 이미 좋아요를 누른 장소 제외
        user_liked_destination_ids = [like.DESTINATION_ID for like in user_likes]
        similar_destinations = [destination for destination in similar_destinations if
                                destination.DESTINATION_ID not in user_liked_destination_ids]

        # 최대한 비슷한 장소로 30개를 채워주기
        if len(similar_destinations) < 30:
            remaining_recommendations = 30 - len(similar_destinations)
            # 비슷한 장소를 추가로 찾아서 추천 목록에 추가
            more_similar_destinations = Destination.objects.exclude(
                DESTINATION_ID__in=user_liked_destination_ids).exclude(
                pk__in=[d.pk for d in similar_destinations])[:remaining_recommendations]
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

        # 추천 결과에서 DESTINATION_ID만 추출하여 리스트에 담기
        destination_ids = [destination.DESTINATION_ID for destination in similar_destinations]

        # 최종 목록에서 place_ids 제외
        destination_ids = [id for id in destination_ids if id not in place_ids]

        # 결과 리스트에 추가
        all_destination_ids.append(destination_ids[:6])

    return Response(all_destination_ids, status=status.HTTP_200_OK)



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

    # 100개의 장소로 제한
    destination_ids = destination_ids[:100]

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
    serializer = DestinationSerializer(similar_destinations[:100], many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)



########################################## 데이터 확인 ##########################################

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
