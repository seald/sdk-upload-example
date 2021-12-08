import hashlib
import secrets
import uuid

from django.db import models, IntegrityError
from django.contrib.auth import models as auth_models
from rest_framework.exceptions import NotAcceptable
import os

from utils.storage import storage


class User(models.Model):
    django_user = models.OneToOneField("auth.User", on_delete=models.CASCADE)
    seald_id = models.CharField(max_length=64, default=None, null=True)

    @classmethod
    def create(cls, email, password):
        try:
            user = User()
            user.django_user = auth_models.User.objects.create_user(
                username=email, email=email, password=password
            )
            user.save()
            return user
        except IntegrityError:
            raise NotAcceptable(detail="User already exists")

    def get_user_license_token(self):
        seald_app_id = os.environ.get("SEALD_APP_ID")
        seald_validation_key = os.environ.get("SEALD_VALIDATION_KEY")
        seald_validation_key_id = os.environ.get("SEALD_VALIDATION_KEY_ID")
        nonce = secrets.token_bytes(32).hex()
        token = hashlib.scrypt(
            f"{self.id}@{seald_app_id}-{seald_validation_key}".encode(),
            salt=nonce.encode(),
            n=16384,
            r=8,
            p=1,
        ).hex()
        return f"{seald_validation_key_id}:{nonce}:{token}"

    def update_seald_id(self, seald_id):
        self.seald_id = seald_id
        self.save()


class Upload(models.Model):
    STATE_UPLOADING = 0
    STATE_FINISHED = 1
    STATES = (
        (STATE_UPLOADING, "STATE_UPLOADING"),
        (STATE_FINISHED, "STATE_FINISHED"),
    )
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    storage_path = models.CharField(max_length=256)
    filename = models.CharField(max_length=128)
    state = models.IntegerField(choices=STATES, default=STATE_UPLOADING)
    session = models.UUIDField(default=uuid.uuid4, db_index=True)

    @classmethod
    def create(cls, user, filename):
        upload = Upload()
        upload.user = user
        upload.filename = os.path.basename(filename)
        upload.save()
        upload.storage_path = f"encrypted_upload/{user.id}/{upload.id}/"
        upload.save()
        storage.create(upload.storage_path)
        return upload

    def push_part(self, data, part):
        storage.push_part(self.storage_path, self.filename, data, part)

    def finalize(self):
        storage.finalize(self.storage_path, self.filename)
        self.state = Upload.STATE_FINISHED
        self.save()

    def get_url(self):
        return storage.get_url(self.storage_path, self.filename)
