from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend

from access.models import AccessRecord
from access.api.serializers import AccessRecordSerializer

class AccessRecordApiViewSet(ModelViewSet):
    Permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = AccessRecordSerializer
    queryset = AccessRecord.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["student_id","date","time_in","time_out"]
