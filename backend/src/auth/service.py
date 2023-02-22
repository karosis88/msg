from hashlib import md5

import sqlalchemy.exc
from fastapi import HTTPException
from jose import jwt
from sqlalchemy import select

from database import SessionLocal
from .config import SECRET_KEY
from .models import User


def hash(data: str):
    return md5(data.encode()).hexdigest()


def authenticate(username: str, password: str):
    with SessionLocal() as session:
        stmt = select(User).where(User.username == username)
        user = session.scalar(stmt)
        if not user or hash(password) != user.password:
            raise HTTPException(status_code=403, detail="Access denied: Invalid username or password")
        return user


def create_access_token(
        form_data: dict
):
    username = form_data.username
    password = form_data.password

    user = authenticate(username, password)

    payload = {
        "header": {},
        "payload": {
            "id": user.id
        },
        "signature": {}
    }
    return jwt.encode(payload, SECRET_KEY)


def decode_jwt(data: dict):
    return jwt.decode(data, SECRET_KEY)


def get_user_object(user_id: int):
    with SessionLocal() as session:
        stmt = select(User).where(User.id == user_id)
        user = session.scalar(stmt)
        return user


def create_user(username: str, password: str):
    password = hash(password)
    with SessionLocal() as session:
        user = User(username=username, password=password)
        session.add(user)
        try:
            session.commit()
        except sqlalchemy.exc.IntegrityError:
            return HTTPException(status_code=400, detail="This username already used")
        return user.id

def find_user(username: str):
    stmt = select(User).where(User.username.ilike(f"%{username}%"))
    with SessionLocal() as session:
        users = session.scalars(stmt).all()
        return users

