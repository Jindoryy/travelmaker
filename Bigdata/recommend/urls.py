from django.urls import path

from . import views

urlpatterns = [
    path('getDestination/', views.getDestination),
    path('getLike/<int:user_id>/', views.getLike),
    path('recommend_destinations/<int:user_id>/', views.recommend_destinations),
]

