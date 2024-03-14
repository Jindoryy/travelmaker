from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

import pandas as pd
import numpy as np
from collections import Counter
from collections import defaultdict
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MultiLabelBinarizer

from recommend.models import Destination,Like
from recommend.serializers import DestinationSerializer,LikeSerializer

@api_view(['GET'])
def getDestination(request):
    destination = Destination.objects.all()
    destination_serializer = DestinationSerializer(destination, many=True)
    destination_df = pd.DataFrame(list(destination.values()))
    print(destination_df.head())
    return Response(destination_serializer.data)

# @api_view(['GET'])
# def getLike(request, user_id):
#     # user_id에 해당하는 사용자가 있는지 확인
#     if not Like.objects.filter(USER_ID=user_id).exists():
#         return Response({"message": "아이디없음"})

#     #flag가 true인 애들만 가져오기
#     like = Like.objects.filter(FLAG=True, USER_ID=user_id)
#     like_df = pd.DataFrame(list(like.values()))
#     like_serializer = LikeSerializer(like, many=True)
#     print(like_df.head())
#     return Response(like_serializer.data)

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
    
    # 결과를 출력 형식에 맞게 변환
    most_common_features_formatted = [f"{idx+1}. {feature[0]}({feature[1]}개)" for idx, feature in enumerate(most_common_features)]
    
    # 직렬화하여 기존 데이터와 함께 반환
    like_serializer = LikeSerializer(like, many=True)
    
    # 가장 많이 등장하는 3개의 FEATURE와 함께 응답 반환
    return Response({
        "most_common_features": most_common_features_formatted,
        "likes": like_serializer.data,
    })


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
#             for destination in similar_destinations:
#                 # 해당 목적지의 특성 가져오기
#                 destination_features = destinations[destination.item()].FEATURE.split(',')
                
#                 # 목적지의 특성과 사용자가 좋아하는 특성의 공통점 찾기
#                 common_features = set(destination_features) & set(top_3_features)
                
#                 if common_features and destination != liked_item and destination not in recommended_items:
#                     recommended_items.append(destination)
#                     if len(recommended_items) >= 30:  # 최소 30개의 추천이 있으면 종료
#                         break
#             if len(recommended_items) >= 30:  # 최소 30개의 추천이 있으면 종료
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


@api_view(['GET'])
def recommend_destinations(request, user_id):
    try:
        # user_id에 해당하는 사용자가 있는지 확인
        if not Like.objects.filter(USER_ID=user_id).exists():
            return Response({"message": "사용자가 좋아하는 항목이 없습니다."})

        # flag가 true인 애들만 가져오기
        like = Like.objects.filter(FLAG=True, USER_ID=user_id)
        like_df = pd.DataFrame(list(like.values()))
        
        # 모든 FEATURE 값을 합치기하고 앞뒤 공백을 제거하여 리스트로 변환
        all_features = [feature.strip() for feature in ','.join(like_df['FEATURE'].tolist()).split(',')]

        # 각 FEATURE의 등장 횟수를 계산하여 가장 많이 등장하는 3개의 FEATURE 찾기
        feature_counts = Counter(all_features)
        top_3_features = [feature[0] for feature in feature_counts.most_common(3)]

        # 사용자가 좋아하는 항목 가져오기
        liked_items = Like.objects.filter(FLAG=True, USER_ID=user_id).values_list('DESTINATION_ID', flat=True)
        
        # 모든 목적지 가져오기
        destinations = Destination.objects.all()
        
        # 목적지의 특성 데이터 가져오기
        feature_lists = [dest.FEATURE.split(',') for dest in destinations]
        
        # MultiLabelBinarizer를 사용하여 원-핫 인코딩 수행
        mlb = MultiLabelBinarizer()
        feature_matrix = mlb.fit_transform(feature_lists)
        
        # 유사도 행렬 계산
        similarity_matrix = cosine_similarity(feature_matrix)

        # 추천할 항목 초기화
        recommended_items = []
        
        # 사용자가 좋아하는 항목과 유사도가 높은 항목 추천
        for liked_item in liked_items:
            # 사용자가 좋아하는 항목과 유사도가 높은 항목 추출
            similar_destinations = np.argsort(similarity_matrix[liked_item - 1])[:-6:-1]
            for destination in similar_destinations:
                # 해당 목적지의 특성 가져오기
                destination_features = destinations[destination.item()].FEATURE.split(',')
                
                # 목적지의 특성과 사용자가 좋아하는 특성의 공통점 찾기
                common_features = set(destination_features) & set(top_3_features)
                
                if common_features and destination != liked_item and destination not in recommended_items:
                    recommended_items.append(destination)
                    if len(recommended_items) >= 20:  # 최소 20개의 추천이 있으면 종료
                        break
            if len(recommended_items) >= 20:  # 최소 20개의 추천이 있으면 종료
                break
        
        # 추천할 항목의 정보 가져오기
        recommended_destinations = []
        for item in recommended_items:
            try:
                recommended_destination = Destination.objects.get(DESTINATION_ID=item)
                recommended_destinations.append(recommended_destination)
            except Destination.DoesNotExist:
                pass
        
        recommended_destinations_serializer = DestinationSerializer(recommended_destinations, many=True)
        
        return Response(recommended_destinations_serializer.data)
    
    except Like.DoesNotExist:
        return Response({"message": "사용자가 좋아하는 항목이 없습니다."})