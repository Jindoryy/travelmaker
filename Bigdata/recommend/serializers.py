from rest_framework import serializers
from recommend.models import Destination, Like, DestinationCopy, Category, LikeCopy

class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = ['DESTINATION_ID', 'CITY_ID', 'NAME', 'TYPE', 'CONTENT', 'FEATURE', 'LATITUDE', 'LONGITUDE']

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = '__all__'

##############################################################

class DestinationCopySerializer(serializers.ModelSerializer):
    class Meta:
        model = DestinationCopy
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

# class LikeCopySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = LikeCopy
#         fields = '__all__'
        
class LikeCopySerializer(serializers.ModelSerializer):
    LIKE_CATEGORIES = serializers.SerializerMethodField()

    def get_LIKE_CATEGORIES(self, like_copy):
        try:
            destination = DestinationCopy.objects.get(DESTINATION_ID=like_copy.DESTINATION_ID)
            feature_codes = destination.FEATURE.split(',')
            feature_names = []
            for code in feature_codes:
                try:
                    category = Category.objects.get(CATEGORY_CODE=code)
                    feature_names.append(category.CATEGORY_NAME)
                except Category.DoesNotExist:
                    pass
            return feature_names
        except DestinationCopy.DoesNotExist:
            return None

    class Meta:
        model = LikeCopy
        fields = ('LIKE_ID', 'DESTINATION_ID', 'USER_ID', 'FLAG', 'LIKE_CATEGORIES')