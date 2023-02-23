from __future__ import annotations

from typing import List, Union

from fastapi import APIRouter, Depends, Path
from fastapi.security import OAuth2PasswordRequestForm

from .service import find_user, get_user_by_username, get_user_by_id, add_friend_request
from .dependencies import get_user, get_user_id
from .schemas import UserCreate, UserView
from .service import create_access_token
from .service import create_user
from .service import add_friend_request
from .service import get_friend_request_list_by_id
from .schemas import FriendRequest
from .service import approve_request

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


@router.post("/friends/approve")
def create(
        user: int,
        self_id=Depends(get_user_id)):
    approve_request(requested_user=self_id, user=user)


@router.post("/friends", response_model=List[FriendRequest])
def friend_list(self_id=Depends(get_user_id)):
    return get_friend_request_list_by_id(self_id)


@router.post("/friends/add")
def add_user(
        username: str,
        self_id=Depends(get_user_id),
):
    user_id = get_user_by_username(username).id
    add_friend_request(user=self_id, requested_user=user_id)
    return 200


@router.post("/user/{id}")
def user_by(id: str):
    if not id.isdigit():
        return get_user_by_username(id)
    else:
        return get_user_by_id(id)


@router.get("/find", response_model=List[UserView])
def find(username: str):
    return find_user(username)
