from rest_framework import serializers


class UploadCreateSerializer(serializers.Serializer):
    email = serializers.CharField(max_length=64)
    filename = serializers.CharField(max_length=64)


class UploadUploadPartSerializer(serializers.Serializer):
    session = serializers.UUIDField()
    part = serializers.IntegerField()
    data = serializers.CharField()


class UploadFinalizeSerializer(serializers.Serializer):
    session = serializers.UUIDField()


class UploadListSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    filename = serializers.CharField()
    url = serializers.SerializerMethodField()

    def get_url(self, obj):
        return obj.get_url()
