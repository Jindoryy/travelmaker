from django.db import models


class Destination(models.Model):
    DESTINATION_ID = models.IntegerField(primary_key=True)
    CITY_ID = models.IntegerField()
    CONTENT_TYPE_ID = models.IntegerField()
    PROVINCE_ID = models.IntegerField()
    LATITUDE = models.FloatField()
    LONGITUDE = models.FloatField()
    CONTENT = models.CharField(max_length=255)
    NAME = models.CharField(max_length=255)
    TYPE = models.CharField(max_length=255)
    FEATURE = models.CharField(max_length=255)
    IMG_URL = models.CharField(max_length=255)

    class Meta:
        db_table = 'destination'

class Likes(models.Model):
    LIKE_ID = models.AutoField(primary_key=True)
    DESTINATION_ID = models.IntegerField()
    USER_ID = models.IntegerField()
    FLAG = models.BooleanField()

    class Meta:
        db_table = 'likes'