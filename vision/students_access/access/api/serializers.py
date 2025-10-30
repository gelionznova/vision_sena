from rest_framework.serializers import ModelSerializer
from access.models import AccessRecord

class AccessRecordSerializer(ModelSerializer):
    class Meta:
        model = AccessRecord
        fields = ["id","student_id","date","time_in","time_out","photo"]