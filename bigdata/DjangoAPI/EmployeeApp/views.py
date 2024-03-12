from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from EmployeeApp.models import Departments,Employees
from EmployeeApp.serializers import DepartmentSerializer,EmployeeSerializer

from django.core.files.storage import default_storage

@api_view(['GET'])
def getDepartment(request):
  departments = Departments.objects.all()
  departments_serializer = DepartmentSerializer(departments, many=True)
  return Response(departments_serializer.data)


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def departmentApi(request, id=0):
    if request.method == 'GET':
        departments = Departments.objects.all()
        departments_serializer = DepartmentSerializer(departments, many=True)
        return Response(departments_serializer.data)

    elif request.method == 'POST':
        department_serializer = DepartmentSerializer(data=request.data)
        if department_serializer.is_valid():
            department_serializer.save()
            return Response("Added Successfully", status=status.HTTP_201_CREATED)
        return Response(department_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'PUT':
        try:
            department = Departments.objects.get(DepartmentId=id)
        except Departments.DoesNotExist:
            return Response("Department not found", status=status.HTTP_404_NOT_FOUND)

        department_serializer = DepartmentSerializer(department, data=request.data)
        if department_serializer.is_valid():
            department_serializer.save()
            return Response("Updated Successfully")
        return Response(department_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        try:
            department = Departments.objects.get(DepartmentId=id)
        except Departments.DoesNotExist:
            return Response("Department not found", status=status.HTTP_404_NOT_FOUND)

        department.delete()
        return Response("Deleted Successfully")


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def employeeApi(request, id=0):
    if request.method == 'GET':
        employees = Employees.objects.all()
        employees_serializer = EmployeeSerializer(employees, many=True)
        return Response(employees_serializer.data)

    elif request.method == 'POST':
        employee_serializer = EmployeeSerializer(data=request.data)
        if employee_serializer.is_valid():
            employee_serializer.save()
            return Response("Added Successfully", status=status.HTTP_201_CREATED)
        return Response(employee_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'PUT':
        try:
            employee = Employees.objects.get(EmployeeId=id)
        except Employees.DoesNotExist:
            return Response("Employee not found", status=status.HTTP_404_NOT_FOUND)

        employee_serializer = EmployeeSerializer(employee, data=request.data)
        if employee_serializer.is_valid():
            employee_serializer.save()
            return Response("Updated Successfully")
        return Response(employee_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        try:
            employee = Employees.objects.get(EmployeeId=id)
        except Employees.DoesNotExist:
            return Response("Employee not found", status=status.HTTP_404_NOT_FOUND)

        employee.delete()
        return Response("Deleted Successfully")

# @api_view(['POST'])
# def SaveFileApi(request):
#     file = request.FILES.get('file')
#     if file:
#         file_name = default_storage.save(file.name, file)
#         return Response(file_name, status=status.HTTP_201_CREATED)
#     else:
#         return Response("No file provided", status=status.HTTP_400_BAD_REQUEST)
