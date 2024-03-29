# models.py
from django.db import models
from datetime import datetime


class User(models.Model):
    STATUS_CHOICES = (
        ('BEFORE_COURSE', '코스전'),
        ('ON_COURSE', '코스중'),
        ('AFTER_COURSE', '코스후'),
    )
    GENDER_CHOICES = (
        ('MALE', '남성'),
        ('FEMALE', '여성'),
    )
    ROLE_CHOICES = (
        ('ROLE_ADMIN', 'ROLE_ADMIN'),
        ('ROLE_USER', 'ROLE_USER'),
    )

    USER_ID = models.BigAutoField(primary_key=True)
    TAG = models.IntegerField(default=1)
    KAKAO_ID = models.BigIntegerField()
    NICKNAME = models.CharField(max_length=50)
    PROFILE_URL = models.URLField(max_length=1000, null=True, blank=True)
    EMAIL = models.EmailField(max_length=255)
    STATUS = models.CharField(max_length=100, choices=STATUS_CHOICES)
    GENDER = models.CharField(max_length=10, choices=GENDER_CHOICES, null=True, blank=True)
    BIRTH = models.DateField(null=True, blank=True)
    ROLE = models.CharField(max_length=20, choices=ROLE_CHOICES)

    class Meta:
        db_table = 'user'

    def calculate_age(self):
        today = datetime.now().date()
        return today.year - self.BIRTH.year - ((today.month, today.day) < (self.BIRTH.month, self.BIRTH.day))

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

# likes의 flag가 bit로 들어오고 있어서 변환 작업이 필요함
class BitBooleanField(models.BooleanField):
    def from_db_value(self, value, expression, connection):
        if value is None:
            return value
        return bool(value)

    def to_python(self, value):
        if value is None:
            return value
        return bool(value)

    def get_db_prep_value(self, value, connection, prepared=False):
        if value is None:
            return value
        return int(value)

class Likes(models.Model):
    LIKE_ID = models.AutoField(primary_key=True)
    DESTINATION_ID = models.IntegerField()
    USER_ID = models.IntegerField()
    FLAG = BitBooleanField(default=False)

    class Meta:
        db_table = 'likes'
