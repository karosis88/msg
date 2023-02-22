from fastapi import APIRouter, Depends

from auth.dependencies import get_user_id
from .dependencies import get_user_chats
from .service import add_message
from .service import create_chat
from .service import get_messages

router = APIRouter()


@router.post("/create")
def create(user_id: int, me=Depends(get_user_id)):
    create_chat(user_id, me)
    return 200


@router.get("/chats")
def chats(chats=Depends(get_user_chats)):
    return chats


@router.get("/messages")
def messages(chat_id: int):
    return get_messages(chat_id)


@router.get("/messages")
def messages(chat_id: int):
    return get_messages(chat_id)


@router.post("/message")
def send_message(chat_id: int,
                 content: str,
                 user_id=Depends(get_user_id)):
    add_message(chat_id=chat_id, content=content, owner_id=user_id)
    return 200
