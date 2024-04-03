from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from recommend.models import Likes
from .algorithms import main_recommend, travel_recommend, city_recommend


# 성별, 나이 기반 추천 + 기본 추천 
@api_view(['GET'])
def getMainList(request, user_id):
    user_likes_count = Likes.objects.filter(USER_ID=user_id, FLAG=1).count()
    
    # 사용자의 좋아요 누른 장소 수에 따라 추천 방식 선택
    if user_likes_count <= 2000:
        # 기준점 이하일 때 user-based 추천(8) + CBF(30)
        gender_age_response = main_recommend.genderAgeRecommend(user_id,8)
        basic_response = main_recommend.basicCbfRecommend(user_id)
    else:
        # 기준점 초과일 때 user-based 추천(4) + CF(30)
        gender_age_response = main_recommend.genderAgeRecommend(user_id,4)
        basic_response = main_recommend.basicCfRecommend(user_id)

    combined_response = {
        "popular": gender_age_response,
        "basic": basic_response
    }
    return Response(combined_response, status=status.HTTP_200_OK)


# 시 내의 사용자 추천 장소 리스트 
@api_view(['POST'])
def getCityList(request):
    result = city_recommend.cityRecommend(request)
    return Response(result, status=status.HTTP_200_OK)


# 군집화 후 장소추천 알고리즘 
@api_view(['POST'])
def getTravelList(request):
    all_destination_ids = travel_recommend.travelRecommend(request.data)
    return Response(all_destination_ids, status=status.HTTP_200_OK)
