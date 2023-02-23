from __future__ import annotations

from typing import List, Union

from fastapi import APIRouter, Depends, Path
from fastapi.security import OAuth2PasswordRequestForm

from .service import find_user, get_user_by_username, get_user_by_id
from .dependencies import get_user
from .schemas import UserCreate, UserView
from .service import create_access_token
from .service import create_user

router = APIRouter()


@router.post("/token")
def token(form_data: OAuth2PasswordRequestForm = Depends()):
    access_token = create_access_token(form_data)
    return {
        'access_token': access_token,
        'username': form_data.username
    }


@router.post("/me", response_model=UserView)
def me(user=Depends(get_user)):
    return user


@router.post("/create")
def create(user: UserCreate):
    created_user = create_user(user.username, user.password)
    return created_user


@router.post("/user/{id}")
def user_by(id: str):
    if not id.isdigit():
        return get_user_by_username(id)
    else:
        print(id, id)
        return get_user_by_id(id)


@router.get("/find", response_model=List[UserView])
def find(username: str):
    return find_user(username)
