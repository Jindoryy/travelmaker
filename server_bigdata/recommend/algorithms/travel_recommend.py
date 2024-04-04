from collections import Counter
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from recommend.models import Destination, Likes

def travelRecommend(request):
    # 결과를 저장할 리스트 초기화
    all_destination_ids = {}

    # 각 요청 객체에 대해 처리
    for key, data in request.items():
        center_latitude = data.get("centerLatitude")
        center_longitude = data.get("centerLongitude")
        r = data.get("r")
        place_ids = data.get("placeIds")
        user_id = data.get("userId")

        # 범위가 너무 작을 때 -> 반지름을 10으로 고정
        if r is not None and r <= 10:
            r = 10      

        # 한 군집 내 7개 이상일 때 필터링
        temp_place_ids = []
        counts = {'sights': 4, 'food': 1, 'cafe': 1}

        for id in place_ids:
            type = Destination.objects.get(DESTINATION_ID=id).TYPE
            if counts.get(type, 0) > 0:
                temp_place_ids.append(id)
                counts[type] -= 1
        place_ids = temp_place_ids

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

        # 필요한 데이터를 한 번에 가져오기
        destinations = Destination.objects.filter(DESTINATION_ID__in=destination_ids).order_by('TYPE')

        # 타입별로 목적지를 분류하고 개수에 맞게 배열 구성
        for dest in destinations:
            if dest.TYPE == 'sights' and sights_number > 0:
                place_ids.append(dest.DESTINATION_ID)
                sights_number -= 1
            elif dest.TYPE == 'food' and food_number > 0:
                place_ids.append(dest.DESTINATION_ID)
                food_number -= 1
            elif dest.TYPE == 'cafe' and cafe_number > 0:
                place_ids.append(dest.DESTINATION_ID)
                cafe_number -= 1

        # 결과 리스트에 추가
        all_destination_ids[key] = place_ids
        
    return all_destination_ids
