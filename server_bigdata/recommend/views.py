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
from datetime import timedelta
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from surprise import Dataset, Reader, KNNBasic, SVD
from surprise.model_selection import train_test_split
from surprise.model_selection import cross_validate
import heapq


######################################################################### 100개로 자르지 말고 섞고 잘라야 할듯
##### 하이브리드 섞는 방법 재고 
@api_view(['GET'])
def getCfList(request, user_id):
    # 사용자가 좋아요를 누른 장소 데이터 가져오기
    user_likes = Likes.objects.filter(USER_ID=user_id)

    # 사용자가 좋아요를 누른 장소의 특징 가져오기
    liked_destinations = [like.DESTINATION_ID for like in user_likes]
    user_features = []
    for dest_id in liked_destinations:
        destination = Destination.objects.get(pk=dest_id)
        user_features.extend(destination.FEATURE.split(','))

    # 중복을 제거하고 리스트로 변환
    user_features = list(set(user_features))

    # Surprise 라이브러리에서 데이터 로드
    reader = Reader(rating_scale=(0, 2))  # 평점 스케일을 0~2로 변경
    dataset = Dataset.load_builtin('ml-100k')
    # print(dataset.raw_ratings[:10])

    # SVD 알고리즘을 사용하여 모델 학습
    algo = SVD()
    cross_validate(algo, dataset, measures=['RMSE', 'MAE'], cv=2, verbose=True)

    # 모든 장소에 대한 예상 평점 계산
    all_destinations = Destination.objects.all()
    predictions = []
    for destination in all_destinations:
        # 각 장소의 특징을 콤마로 분리하여 리스트로 변환
        features = destination.FEATURE.split(',')
        # 사용자가 좋아하는 특징과 장소의 특징의 교집합 계산
        common_features = set(user_features) & set(features)
        # 교집합의 크기를 사용자가 좋아하는 특징의 수로 나눠서 유사도 산출
        similarity = len(common_features) / len(user_features)
        # 유사도를 가중치로 사용하여 장소의 예상 평점 계산
        pred = predict_destination_rating(algo, user_id, features, similarity)
        predictions.append((destination, pred))

    # 결과를 예상 평점에 따라 정렬하여 상위 N개의 장소 추출
    top_n = heapq.nlargest(100, predictions, key=lambda x: x[1])
    print(top_n)

    # 추천된 장소들의 정보를 가져옴
    recommended_destinations = [pred[0] for pred in top_n]

    # 직렬화하여 JSON 응답으로 반환
    serializer = DestinationSerializer(recommended_destinations, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


def predict_destination_rating(algo, user_id, features, similarity):
    # 특징을 고려하여 장소의 예상 평점 계산
    rating_sum = 0
    total_weight = 0
    for feature in features:
        # 각 특징에 대한 예상 평점 계산
        pred = algo.predict(user_id, feature)
        # 유사도를 가중치로 사용하여 평점에 반영
        rating_sum += pred.est * similarity
        total_weight += similarity

    # 가중평균 평점 계산
    if total_weight > 0:
        return rating_sum / total_weight
    else:
        return 0  # 특징이 없는 경우 평점을 0으로 반환


######################################## 성별, 나이 기반 추천 + 기본 추천 ########################################
@api_view(['GET'])
def getMainList(request, user_id):
    gender_age_response = getGenderAgeRecommend(user_id)
    basic_cbf_list_response = getBasicCbfRecommend(user_id)

    combined_response = {
        "popular": gender_age_response.data,
        "basic": basic_cbf_list_response.data
    }

    return Response(combined_response, status=status.HTTP_200_OK)

def getGenderAgeRecommend(user_id):
    # 요청으로부터 사용자 정보 가져오기
    user = User.objects.get(USER_ID=user_id)
    
    if not user.GENDER or not user.BIRTH:
        return Response([])

    # 사용자의 성별과 나이 정보 가져오기
    user_gender = user.GENDER
    user_age = user.calculate_age()
    
    # 모든 사용자의 좋아요 정보 가져오기
    all_users_likes = Likes.objects.filter(FLAG=1).values('USER_ID', 'DESTINATION_ID')

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

# TF-IDF를 사용하여 특성 텍스트를 벡터화하고, 사용자의 특성을 기반으로 코사인 유사도를 계산하여 유사한 장소를 추천합니다.
# 그나마 비슷한 애들로 추천 + 목록 골고루 섞기
def getBasicCbfRecommend(user_id):
    # 사용자가 좋아요를 누른 장소의 특성을 가져오기
    user_likes = Likes.objects.filter(USER_ID=user_id, FLAG=1)
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



######################################## 시 내의 사용자 추천 장소 리스트 ########################################
@api_view(['POST'])
def getCityList(request):
    # 요청에서 데이터 추출
    user_ids = request.data.get("userId", [])
    city_id = request.data.get("cityId")

    # 결과를 저장할 딕셔너리 초기화
    result = defaultdict(list)

    # 모든 사용자 및 친구들의 좋아요 데이터를 가져와서 사용자별로 특성을 추출하고 가중치를 계산
    all_user_features = defaultdict(list)
    for user_id in user_ids:
        user_likes = Likes.objects.filter(USER_ID=user_id, FLAG=1)
        for like in user_likes:
            destination = Destination.objects.filter(DESTINATION_ID=like.DESTINATION_ID).first()
            if destination:
                all_user_features[user_id].extend(destination.FEATURE.split(','))

    # 각 사용자 및 친구들의 특성을 가중치로 변환
    weighted_features = Counter()
    for user_id, features in all_user_features.items():
        feature_counter = Counter(features)
        total_likes = sum(feature_counter.values())
        weighted_features.update({feature: count / total_likes for feature, count in feature_counter.items()})

    # cityId 맞는 모든 장소 가져오기
    similar_destinations = Destination.objects.filter(CITY_ID=city_id)

    # TF-IDF를 위한 텍스트 데이터 변환
    feature_texts = [destination.FEATURE for destination in similar_destinations]

    # TF-IDF 벡터화
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(feature_texts)

    # 특성별 TF-IDF 가중치 계산
    feature_names = vectorizer.get_feature_names_out()
    feature_tfidf = dict(zip(feature_names, tfidf_matrix.sum(axis=0).tolist()[0]))

    # 각 장소의 특성 가중치 계산
    for destination in similar_destinations:
        feature_importance = sum(weighted_features[feature] * feature_tfidf.get(feature, 0) for feature in destination.FEATURE.split(','))
        result[destination.TYPE].append((destination.DESTINATION_ID, feature_importance))

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
    all_destination_ids = {}

    # 각 요청 객체에 대해 처리
    for key, data in request_data.items():
        center_latitude = data.get("centerLatitude")
        center_longitude = data.get("centerLongitude")
        r = data.get("r")
        place_ids = data.get("placeIds")
        user_id = data.get("userId")

        # place_ids의 id값을 가지고 destination.type 별 개수를 계산
        type_counts = Counter(Destination.objects.filter(DESTINATION_ID__in=place_ids).values_list('TYPE', flat=True))

        # 추천 받아야 하는 장소의 개수
        sights_number = max(0, 4 - type_counts.get('sights', 0))
        food_number = max(0, 1 - type_counts.get('food', 0))
        cafe_number = max(0, 1 - type_counts.get('cafe', 0))


        # 사용자가 좋아요를 누른 장소의 특성을 가져오기
        user_likes = Likes.objects.filter(USER_ID=user_id, FLAG=1)
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

        # 유사한 장소 중 범위 내에 있는 장소만 선택
        lat_range = (center_latitude - 0.00904371733 * r, center_latitude + 0.00904371733 * r)
        lon_range = (center_longitude - 0.01112000 * r, center_longitude + 0.01112000 * r)
        similar_destinations_within_range = [destination for destination in similar_destinations
                                            if lat_range[0] <= destination.LATITUDE <= lat_range[1]
                                            and lon_range[0] <= destination.LONGITUDE <= lon_range[1]][:30]
        
        # 각 타입별로 최대 30개씩 장소를 추출하여 유사한 장소 중 범위 내 장소에 추가
        for destination_type in ['sights', 'food', 'cafe']:
            # 범위 내의 해당 타입의 장소 추출
            destinations_within_range = Destination.objects.filter(
                TYPE=destination_type,
                LATITUDE__range=(center_latitude - 0.00904371733 * r, center_latitude + 0.00904371733 * r),
                LONGITUDE__range=(center_longitude - 0.01112000 * r, center_longitude + 0.01112000 * r)
            )[:30]  # 최대 30개까지만 추출

            # 유사한 장소 중 범위 내에 있는 장소에 추가
            similar_destinations_within_range.extend(destinations_within_range)

        # 중복 제거
        similar_destinations_within_range = list(set(similar_destinations_within_range))

        # TF-IDF 벡터화
        tfidf_vectorizer = TfidfVectorizer()
        feature_texts = [' '.join(destination.FEATURE.split(',')) for destination in similar_destinations_within_range]
        tfidf_matrix = tfidf_vectorizer.fit_transform(feature_texts)

        # 코사인 유사도 계산
        user_feature_text = ' '.join(user_features)
        user_tfidf = tfidf_vectorizer.transform([user_feature_text])
        similarities = cosine_similarity(user_tfidf, tfidf_matrix).flatten()

        # 유사도에 따라 장소 정렬
        similar_destinations_within_range = [similar_destinations_within_range[i] for i in similarities.argsort()[::-1]]

        # 추천 결과에서 DESTINATION_ID만 추출하여 리스트에 담기
        destination_ids = [destination.DESTINATION_ID for destination in similar_destinations_within_range]

        # 최종 목록에서 place_ids 제외
        destination_ids = [id for id in destination_ids if id not in place_ids]

        # type별 개수에 맞춰서 배열 구성
        for _ in range(sights_number+food_number+cafe_number):
            for id in destination_ids:
                type = Destination.objects.get(DESTINATION_ID=id).TYPE
                if type == 'sights' and sights_number > 0:
                        place_ids.append(id)
                        sights_number -= 1
                elif type == 'food' and food_number > 0:
                        place_ids.append(id)
                        food_number -= 1
                elif type == 'cafe' and cafe_number > 0:
                        place_ids.append(id)
                        cafe_number -= 1

        # 결과 리스트에 추가
        all_destination_ids[key] = place_ids

    return Response(all_destination_ids, status=status.HTTP_200_OK)


########################################## 데이터 확인 ##########################################
# 그나마 비슷한 애들로 추천 + 목록 골고루 섞기
@api_view(['GET'])
def getLikeCbfDetail(request, user_id):
    # 사용자가 좋아요를 누른 장소의 특성을 가져오기
    user_likes = Likes.objects.filter(USER_ID=user_id, FLAG=1)
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

@api_view(['GET'])
def getLike(request, user_id):
    user_likes = Likes.objects.filter(USER_ID=user_id)
    like_serializer = LikeSerializer(user_likes, many=True)
    return Response(like_serializer.data)

@api_view(['GET'])
def getDestination(request):
    destination = Destination.objects.all()
    destination_serializer = DestinationSerializer(destination, many=True)
    destination_df = pd.DataFrame(list(destination.values()))
    print(destination_df.head())
    return Response(destination_serializer.data)

@api_view(['POST'])
def getDestinationList(request):
    ids = request.data.get('ids', [])
    destinations = Destination.objects.filter(DESTINATION_ID__in=ids)
    destination_serializer = DestinationSerializer(destinations, many=True)
        
    destination_df = pd.DataFrame(list(destinations.values()))
    print(destination_df.head())
        
    return Response(destination_serializer.data)