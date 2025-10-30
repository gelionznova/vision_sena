from rest_framework.routers import DefaultRouter
from access.api.views import AccessRecordApiViewSet

router_accessRecord = DefaultRouter()

router_accessRecord.register(
    prefix="accessrecord", basename="accessrecord", viewset=AccessRecordApiViewSet
)