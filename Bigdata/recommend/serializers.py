from rest_framework import serializers
from recommend.models import Destination, Like

class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = ['DESTINATION_ID', 'CITY_ID', 'NAME', 'TYPE', 'CONTENT', 'FEATURE', 'LATITUDE', 'LONGITUDE']

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = '__all__'