from datetime import datetime
import jwt
import os

seald_app_id = os.environ.get("SEALD_JWT_SHARED_SECRET_ID")
seald_validation_key = os.environ.get("SEALD_JWT_SHARED_SECRET")


def generate_encryption_token(user_seald_id):
    jwt_token = jwt.encode(
        {
            "iss": seald_app_id,
            "iat": datetime.now(),
            "scopes": [-1],
            "recipients": [user_seald_id],
            "owner": user_seald_id,
        },
        seald_validation_key,
        algorithm="HS256",
    )
    return jwt_token
