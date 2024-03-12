from django.urls import path

from .views import getDepartment, departmentApi, employeeApi

urlpatterns = [
    path('getDepartment/', getDepartment),
    path('department/', departmentApi),
    path('department/<int:id>/', departmentApi),
    path('employee/', employeeApi),
    path('employee/<int:id>/', employeeApi),
]

