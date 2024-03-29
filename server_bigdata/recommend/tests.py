from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

import random
import pandas as pd
from collections import Counter
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

from recommend.models import Destination,Likes
from recommend.serializers import DestinationSerializer,LikeSerializer

# 데이터 확인 
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