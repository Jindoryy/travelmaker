from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import pandas as pd

from recommend.models import Destination
from recommend.serializers import DestinationSerializer

from django.core.files.storage import default_storage

@api_view(['GET'])
def db_dataframe_test1(request):
    destination = Destination.objects.all()
    destination_serializer = DestinationSerializer(destination, many=True)
    destination_df = pd.DataFrame(list(destination.values()))
    print(destination_df.head()) # 출력 확인
    return Response(destination_serializer.data)
