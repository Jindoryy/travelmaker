from django.urls import path

from . import views

urlpatterns = [
    # 메인페이지 알고리즘(성별, 나이 기반 + 기본 추천)
    path('getMainList/<int:user_id>/', views.getMainList),

    # 군집 범위 내 추천 알고리즘
    path('getTravelList', views.getTravelList),

    # 시 기반 추천 알고리즘
    path('getCityList', views.getCityList),

    # 확인용
    path('getDestination', views.getDestination),
    path('getLike/<int:user_id>/', views.getLike),
    path('getLikeCbfDetail/<int:user_id>/', views.getLikeCbfDetail),
]

