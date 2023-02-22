import sqlalchemy.exc
from sqlalchemy import insert, select

from database import SessionLocal
from .models import Chat
from .models import Message
from fastapi import HTTPException


def create_chat(user1, user2):
    with SessionLocal() as session:
        stmt = insert(Chat).values(user1=user1, user2=user2)
        try:
            session.execute(stmt)
            session.commit()
        except sqlalchemy.exc.IntegrityError:
            raise HTTPException(status_code=400, detail="Resource already exists")


def add_message(chat_id: int, content: str, owner_id: int):
    message = Message(chat_id=chat_id, content=content, owner_id=owner_id)

    with SessionLocal() as session:
        session.add(message)
        session.commit()


def get_messages(chat_id: int):
    stmt = select(Chat).where(Chat.id == chat_id)
    with SessionLocal() as session:
        chat = session.scalar(stmt)
        if not chat:
            raise HTTPException(status_code=400, detail="Resource does not exists")
        return chat.messages
