from django.urls import path

from .views import db_dataframe_test1

urlpatterns = [
    path('pandas1/', db_dataframe_test1),
]

