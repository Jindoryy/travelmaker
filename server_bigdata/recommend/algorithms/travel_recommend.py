from collections import Counter
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from recommend.models import Destination, Likes

def travelRecommend(request):
    all_destination_ids = {}

    # Destination 정보 미리 가져오기
    all_destinations = Destination.objects.all()

    for key, data in request.items():
        center_latitude = data.get("centerLatitude")
        center_longitude = data.get("centerLongitude")
        r = max(data.get("r", 10), 10)
        place_ids = data.get("placeIds")
        user_id = data.get("userId")

        temp_place_ids = []
        counts = {'sights': 4, 'food': 1, 'cafe': 1}

        for id in place_ids:
            destination = next((d for d in all_destinations if d.DESTINATION_ID == id), None)
            if destination:
                type = destination.TYPE
                if counts.get(type, 0) > 0:
                    temp_place_ids.append(id)
                    counts[type] -= 1
        place_ids = temp_place_ids

        type_counts = Counter([destination.TYPE for destination in all_destinations if destination.DESTINATION_ID in place_ids])

        sights_number = max(0, 4 - type_counts.get('sights', 0))
        food_number = max(0, 1 - type_counts.get('food', 0))
        cafe_number = max(0, 1 - type_counts.get('cafe', 0))

        user_likes = Likes.objects.filter(USER=user_id, FLAG=True).select_related('DESTINATION')
        user_features = ','.join(like.DESTINATION.FEATURE for like in user_likes)

        feature_counter = Counter(user_features.split(','))

        top_features = [feature for feature, _ in feature_counter.most_common(10)]

        similar_destinations = []
        for feature in top_features:
            destinations_with_feature = [d for d in all_destinations if feature in d.FEATURE]
            similar_destinations.extend(destinations_with_feature)

        lat_range = (center_latitude - 0.00904371733 * r, center_latitude + 0.00904371733 * r)
        lon_range = (center_longitude - 0.01112000 * r, center_longitude + 0.01112000 * r)
        similar_destinations_within_range = [destination for destination in similar_destinations
                                             if lat_range[0] <= destination.LATITUDE <= lat_range[1]
                                             and lon_range[0] <= destination.LONGITUDE <= lon_range[1]][:30]

        for destination_type in ['sights', 'food', 'cafe']:
            destinations_within_range = [d for d in all_destinations
                                         if d.TYPE == destination_type
                                         and lat_range[0] <= d.LATITUDE <= lat_range[1]
                                         and lon_range[0] <= d.LONGITUDE <= lon_range[1]][:30]

            similar_destinations_within_range.extend(destinations_within_range)

        similar_destinations_within_range = list(set(similar_destinations_within_range))

        tfidf_vectorizer = TfidfVectorizer()
        feature_texts = [' '.join(destination.FEATURE.split(',')) for destination in similar_destinations_within_range]
        tfidf_matrix = tfidf_vectorizer.fit_transform(feature_texts)

        user_feature_text = ' '.join(user_features.split(','))
        user_tfidf = tfidf_vectorizer.transform([user_feature_text])
        similarities = cosine_similarity(user_tfidf, tfidf_matrix).flatten()

        similar_destinations_within_range = [similar_destinations_within_range[i] for i in similarities.argsort()[::-1]]

        destination_ids = [destination.DESTINATION_ID for destination in similar_destinations_within_range]

        destination_ids = [id for id in destination_ids if id not in place_ids]

        for _ in range(sights_number+food_number+cafe_number):
            for id in destination_ids:
                destination = next((d for d in all_destinations if d.DESTINATION_ID == id), None)
                if destination:
                    type = destination.TYPE
                    if type == 'sights' and sights_number > 0:
                        place_ids.append(id)
                        sights_number -= 1
                    elif type == 'food' and food_number > 0:
                        place_ids.append(id)
                        food_number -= 1
                    elif type == 'cafe' and cafe_number > 0:
                        place_ids.append(id)
                        cafe_number -= 1

        all_destination_ids[key] = place_ids

    return all_destination_ids
