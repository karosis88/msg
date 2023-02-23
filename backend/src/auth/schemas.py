from datetime import datetime
from enum import Enum

from pydantic import BaseModel
from pydantic import Field


class UserCreate(BaseModel):
    username: str = Field(min_length=4, max_length=30)
    password: str = Field(min_length=4, max_length=30)


class UserView(BaseModel):
    username: str = Field(min_length=4, max_length=30)
    created_at: datetime
    last_login: datetime
    id: int

    class Config:
        orm_mode = True


class FriendRequest(BaseModel):
    user1: int = Field(alias="user")
    user2: int = Field(alias="requested_user")
    created_at: datetime
    state: Enum

    class Config:
        orm_mode = True
