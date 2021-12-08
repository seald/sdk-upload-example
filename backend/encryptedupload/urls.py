import os

from django.urls import path
from django.conf.urls import include
from api.urls import router as api_router
from utils.static import static
from utils.storage import fs

urlpatterns = [
    path("api/", include(api_router.urls)),
]

if os.environ.get("STORAGE_METHOD", "fs") == "fs":
    urlpatterns += static("/data/", document_root=fs.base_dir)
