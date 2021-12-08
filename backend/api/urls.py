from rest_framework import routers

from api.views.upload import UploadView
from api.views.user import UserView

router = routers.SimpleRouter()
router.register(r"users", UserView, basename="api_user")
router.register(r"uploads", UploadView, basename="api_upload")
