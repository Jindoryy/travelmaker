from rest_framework import serializers
from recommend.models import User, Destination, Likes
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


# class UserSerializer(serializers.ModelSerializer):
#     GENERATION = serializers.SerializerMethodField()
    
#     class Meta:
#         model = User
#         fields = '__all__'
        
#     def get_GENERATION(self, obj):
#         birth_date = obj.BIRTH
#         if birth_date:
#             birth_year = birth_date.year
#             current_year = datetime.now().year
#             age = current_year - birth_year
#             generation = (age // 10) * 10
#             return generation
#         else:
#             return None

class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = '__all__'

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Likes
        fields = '__all__'