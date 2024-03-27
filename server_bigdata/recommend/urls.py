from django.urls import path

from . import views

urlpatterns = [
    # 메인페이지 알고리즘(성별, 나이 기반 + 기본 추천)
    path('main-list/<int:user_id>/', views.getMainList),

    # 군집 범위 내 추천 알고리즘
    path('travel-list', views.getTravelList),

    # 시 기반 추천 알고리즘
    path('city-list', views.getCityList),

    # 확인용
    path('destination-all-list', views.getDestination),
    path('destination-id-list', views.getDestinationList),
    path('like-user-list/<int:user_id>/', views.getLike),
    path('basic-recommend-detail/<int:user_id>/', views.getLikeCbfDetail),
]

