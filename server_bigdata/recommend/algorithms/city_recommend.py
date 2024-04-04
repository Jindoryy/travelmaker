from collections import defaultdict, Counter
from sklearn.feature_extraction.text import TfidfVectorizer
from recommend.models import Destination, Likes

def cityRecommend(request):
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

    return result
