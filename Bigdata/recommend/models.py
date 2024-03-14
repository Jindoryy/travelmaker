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
        db_table = 'destination'