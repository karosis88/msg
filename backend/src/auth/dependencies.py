from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from .service import decode_jwt
from .service import get_user_object

oauth = OAuth2PasswordBearer(tokenUrl='/auth/token')


def get_user_id(token: str = Depends(oauth)):
    data = decode_jwt(token)
    user_id = data["payload"]["id"]
    return user_id


def get_user(user_id = Depends(get_user_id)):
    return get_user_object(user_id)
