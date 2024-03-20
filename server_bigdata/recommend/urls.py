from django.urls import path

from . import views

urlpatterns = [
    path('getDestination/', views.getDestination),
    # path('getDestinationCopy/', views.getDestinationCopy),
    # path('getCategory/', views.getCategory),

    path('getLike/<int:user_id>/', views.getLike),
    # path('getLikeCopy/<int:user_id>/', views.getLikeCopy),

    # path('recommend_destinations/<int:user_id>/', views.recommend_destinations),
    path('getLikeCbfList/<int:user_id>/', views.getLikeCbfList),
    path('getLikeCbfDetail/<int:user_id>/', views.getLikeCbfDetail),
]

