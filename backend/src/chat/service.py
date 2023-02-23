import json

import sqlalchemy.exc
from fastapi import HTTPException
from fastapi import WebSocket
from sqlalchemy import insert, select

from auth.models import User
from auth.service import get_user_by_username
from database import SessionLocal
from .models import Chat
from .models import Message

connections = {

}


def get_chat(user1, user2):
    with SessionLocal() as session:
        stmt = select(Chat).where(Chat.user1 == user1).where(Chat.user2 == user2)
        chat = session.scalar(stmt)
        if not chat:
            return None
        return chat


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
    with SessionLocal() as session:
        stmt = select(Message, User.username).join(Message.owner).where(Message.chat_id == chat_id)
        results = session.execute(stmt).all()
        new_results = []
        for message, owner in results:
            new_results.append(message.__dict__)
            new_results[-1]["owner_username"] = owner
        return new_results


async def handle_messages(websocket: WebSocket, context):
    while True:
        message = await websocket.receive_json()
        message = json.loads(message)
        user, content = message["for"], message["content"]
        user_id = get_user_by_username(user).id
        chat = get_chat(user_id, context["socket_owner"]["id"])

        if not chat:
            chat = create_chat(user_id, context["socket_owner"]["id"])
        add_message(chat.id, content, context["socket_owner"]["id"])

        if user in connections and websocket is not connections[user]:
            await connections[user].send_json({"from": context["socket_owner"]["username"],
                                                          "content": message["content"]})
