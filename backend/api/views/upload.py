import base64

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import NotAuthenticated
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from api.models import User, Upload
from api.serializers.upload import (
    UploadCreateSerializer,
    UploadUploadPartSerializer,
    UploadFinalizeSerializer,
    UploadListSerializer,
)
from utils.seald import generate_encryption_token


class UploadView(viewsets.ViewSet):
    def create(self, request):
        serializer = UploadCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = get_object_or_404(
            User, django_user__email=serializer.validated_data["email"]
        )
        upload = Upload.create(user, serializer.validated_data["filename"])
        return Response(
            {
                "upload": {
                    "session": upload.session,
                },
                "encryption_token": generate_encryption_token(user.seald_id),
            }
        )

    @action(methods=["POST"], detail=False)
    def upload_part(self, request):
        serializer = UploadUploadPartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        upload = get_object_or_404(
            Upload,
            state=Upload.STATE_UPLOADING,
            session=serializer.validated_data["session"],
        )
        upload.push_part(
            base64.b64decode(serializer.validated_data["data"]),
            serializer.validated_data["part"],
        )
        return Response({"status": "ok"})

    @action(methods=["POST"], detail=False)
    def finalize(self, request, pk=None):
        serializer = UploadFinalizeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        upload = get_object_or_404(
            Upload,
            state=Upload.STATE_UPLOADING,
            session=serializer.validated_data["session"],
        )
        upload.finalize()
        return Response({"status": "ok"})

    def list(self, request):
        if request.user and request.user.is_anonymous:
            raise NotAuthenticated
        try:
            user = User.objects.get(django_user=request.user)
            uploads = user.upload_set.filter(state=Upload.STATE_FINISHED).order_by(
                "-id"
            )
            return Response({"uploads": UploadListSerializer(uploads, many=True).data})
        except User.DoesNotExist:
            raise NotAuthenticated
