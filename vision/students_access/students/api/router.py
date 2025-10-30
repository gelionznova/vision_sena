from rest_framework.routers import DefaultRouter
from students.api.views import StudentApiViewSet

router_student = DefaultRouter()
router_student.register(
    prefix="students", basename="students", viewset=StudentApiViewSet
)