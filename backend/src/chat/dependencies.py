from fastapi import Depends
from sqlalchemy import or_, select

from auth.dependencies import get_user_id
from auth.service import get_user_by_username
from chat.models import Chat
from database import SessionLocal


def get_user_chats(user_id: int = Depends(get_user_id)):
    stmt = select(Chat).where(or_(Chat.user1 == user_id, Chat.user2 == user_id))
    with SessionLocal() as session:
        chats = session.scalars(stmt).all()
        return chats
