from typing import Union

from pydantic import BaseModel
from pydantic import Field
from datetime import datetime


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
