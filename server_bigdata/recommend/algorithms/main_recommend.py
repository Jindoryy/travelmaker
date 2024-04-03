import random
import heapq
import pandas as pd
from datetime import timedelta
from collections import Counter
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from surprise import SVD, Dataset, Reader
from surprise.model_selection import cross_validate
from recommend.models import Likes, Destination, User


def genderAgeRecommend(user_id, num_result):
    # 요청으로부터 사용자 정보 가져오기
    user = User.objects.get(USER_ID=user_id)
    
    if not user.GENDER or not user.BIRTH:
        return []

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
    top_destinations = similar_likes_count.sort_values(by='count', ascending=False).head(num_result)
    top_destination_ids = top_destinations['DESTINATION_ID'].tolist()
    
    return top_destination_ids



def getRandomDestinations(limit=60):
    # 완전 랜덤 장소 목록 생성
    random_destinations = Destination.objects.order_by('?')[:limit]
    random_destination_ids = [destination.DESTINATION_ID for destination in random_destinations]
    return random_destination_ids


# TF-IDF를 사용하여 특성 텍스트를 벡터화하고, 사용자의 특성을 기반으로 코사인 유사도를 계산하여 유사한 장소를 추천합니다.
def basicCbfRecommend(user_id):
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
    destination_ids = destination_ids[:25] + getRandomDestinations(25)
    random.shuffle(destination_ids)

    return destination_ids



def predict_destination_rating(algo, user_id, features, similarity):
    # 사용자가 좋아하는 특징에 대한 예상 평점 계산
    predictions = [algo.predict(user_id, feature).est for feature in features]

    # 가중 평균 평점 계산
    total_weighted_rating = sum(pred * similarity for pred in predictions)
    total_weight = sum(similarity for _ in predictions)

    if total_weight > 0:
        return total_weighted_rating / total_weight
    else:
        return 0  # 특징이 없는 경우 평점을 0으로 반환


def basicCfRecommend(user_id):
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
    top_100 = heapq.nlargest(20000, predictions, key=lambda x: x[1])
    random.shuffle(top_100)
    top_100 = top_100[:50]

    recommended_destination_ids = [pred[0].DESTINATION_ID for pred in top_100]

    return recommended_destination_ids
