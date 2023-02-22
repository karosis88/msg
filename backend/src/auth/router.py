from typing import List

from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

from .service import find_user
from .dependencies import get_user
from .schemas import UserCreate, UserView
from .service import create_access_token
from .service import create_user

router = APIRouter()


@router.post("/token")
def token(form_data: OAuth2PasswordRequestForm = Depends()):
    access_token = create_access_token(form_data)
    return {'access_token': access_token}


@router.post("/me", response_model=UserView)
def me(user=Depends(get_user)):
    return user


@router.post("/create")
def create(user: UserCreate):
    created_user = create_user(user.username, user.password)
    return created_user

@router.get("/find", response_model=List[UserView])
def find(username: str):
    return find_user(username)
