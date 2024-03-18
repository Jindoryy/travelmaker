from django.db import models

class Destination(models.Model):
    DESTINATION_ID = models.AutoField(primary_key=True)
    CITY_ID = models.IntegerField()
    NAME = models.CharField(max_length=50)
    TYPE_CHOICES = [
        ('food', '음식'),
        ('sights', '관광지'),
        ('cafe', '카페'),
    ]
    TYPE = models.CharField(max_length=100, choices=TYPE_CHOICES)
    CONTENT = models.CharField(max_length=1000)
    FEATURE = models.CharField(max_length=1000)
    LATITUDE = models.FloatField()
    LONGITUDE = models.FloatField()
    IMG_URL = models.CharField(max_length=100, default='img')

    class Meta:
        db_table = 'DESTINATION'

class Like(models.Model):
    LIKE_ID = models.AutoField(primary_key=True)
    DESTINATION_ID = models.IntegerField()
    USER_ID = models.IntegerField()
    FLAG = models.BooleanField()
    FEATURE = models.CharField(max_length=1000)

    class Meta:
        db_table = 'LIKE'


# ################## test 테이블 ##################
class DestinationCopy(models.Model):
    DESTINATION_ID = models.IntegerField(primary_key=True)
    CITY_ID = models.IntegerField()
    NAME = models.CharField(max_length=50)
    TYPE_CHOICES = [
        ('food', '음식'),
        ('sights', '관광지'),
        ('cafe', '카페'),
    ]
    TYPE = models.CharField(max_length=100, choices=TYPE_CHOICES)
    CONTENT = models.CharField(max_length=1000, default='-')
    FEATURE = models.CharField(max_length=1000)
    LATITUDE = models.FloatField()
    LONGITUDE = models.FloatField()
    IMG_URL = models.CharField(max_length=100, default='img')
    CONTENT_TYPE_ID = models.IntegerField()

    class Meta:
        db_table = 'DESTINATIONCOPY'

class LikeCopy(models.Model):
    LIKE_ID = models.AutoField(primary_key=True)
    DESTINATION_ID = models.IntegerField()
    USER_ID = models.IntegerField()
    FLAG = models.BooleanField()

    class Meta:
        db_table = 'LIKECOPY'

class Category(models.Model):
    CATEGORY_ID = models.AutoField(primary_key=True)
    CATEGORY_CODE = models.CharField(max_length=50)
    CATEGORY_NAME = models.CharField(max_length=100)

    class Meta:
        db_table = 'CATEGORY'