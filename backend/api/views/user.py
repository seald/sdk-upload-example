from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import AuthenticationFailed, NotAuthenticated
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from django.contrib.auth import login, logout
from api.models import User
from api.serializers.user import (
    UserCreateSerializer,
    UserLoginSerializer,
    UserFindSerializer,
    UserSerializer,
    UserUpdateSealdIdSerializer,
)


class UserView(viewsets.ViewSet):
    def create(self, request):
        serializer = UserCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.create(
            email=serializer.validated_data["email"],
            password=serializer.validated_data["password"],
        )
        return Response(
            {
                "user": UserSerializer(user).data,
                "seald_user_license_token": user.get_user_license_token(),
            }
        )

    @action(methods=["POST"], detail=False)
    def login(self, request):
        try:
            serializer = UserLoginSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = User.objects.get(
                django_user__email=serializer.validated_data["email"]
            )
            if not user.django_user.check_password(
                serializer.validated_data["password"]
            ):
                raise AuthenticationFailed(detail=None)
            login(request, user.django_user)
            return Response({"user": UserSerializer(user).data})
        except User.DoesNotExist:
            raise AuthenticationFailed(detail=None)

    @action(methods=["POST"], detail=False)
    def logout(self, request):
        logout(request)
        return Response({"status": "ok"})

    @action(methods=["GET"], detail=False)
    def status(self, request):
        if request.user and request.user.is_anonymous:
            raise NotAuthenticated
        try:
            user = User.objects.get(django_user=request.user)
            return Response({"user": UserSerializer(user).data})
        except User.DoesNotExist:
            raise NotAuthenticated

    @action(methods=["POST"], detail=False)
    def find(self, request):
        serializer = UserFindSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = get_object_or_404(
            User, django_user__email=serializer.validated_data["email"]
        )
        return Response({"user": UserSerializer(user).data})

    @action(methods=["POST"], detail=False)
    def update_seald_id(self, request):
        if request.user and request.user.is_anonymous:
            raise NotAuthenticated
        serializer = UserUpdateSealdIdSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = get_object_or_404(User, django_user=request.user)
        user.update_seald_id(serializer.validated_data["seald_id"])
        return Response({"user": UserSerializer(user).data})
