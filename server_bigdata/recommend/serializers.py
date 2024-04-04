from rest_framework import serializers
from recommend.models import User, Destination, Likes
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = '__all__'
        
class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Likes
        fields = '__all__'