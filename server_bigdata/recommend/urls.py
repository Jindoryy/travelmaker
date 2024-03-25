from django.urls import path

from . import views

urlpatterns = [
    path('getDestination/', views.getDestination),
    path('getLike/<int:user_id>/', views.getLike),

    path('getMainList/<int:user_id>/', views.getMainList),
    path('getLikeCbfList/<int:user_id>/', views.getLikeCbfList),
    path('getLikeCbfDetail/<int:user_id>/', views.getLikeCbfDetail),

    path('getTravelList/', views.getTravelList),

    path('getCityList/', views.getCityList),
]

