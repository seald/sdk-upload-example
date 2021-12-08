from rest_framework import serializers


class UserCreateSerializer(serializers.Serializer):
    email = serializers.CharField(max_length=64)
    password = serializers.CharField(max_length=64)


class UserLoginSerializer(serializers.Serializer):
    email = serializers.CharField(max_length=64)
    password = serializers.CharField(max_length=64)


class UserFindSerializer(serializers.Serializer):
    email = serializers.CharField(max_length=64)


class UserSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    email = serializers.SerializerMethodField()
    seald_id = serializers.CharField()

    def get_email(self, obj):
        return obj.django_user.email


class UserUpdateSealdIdSerializer(serializers.Serializer):
    seald_id = serializers.UUIDField()
