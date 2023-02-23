from fastapi import APIRouter, Depends
from fastapi import WebSocket

from auth.dependencies import get_user_id
from auth.service import get_user_by_username, decode_jwt, get_user_by_id
from .dependencies import get_user_chats
from .service import add_message, get_chat, handle_messages
from .service import create_chat
from .service import get_messages
from .service import connections

router = APIRouter()


@router.post("/create")
def create(user_id: int, me=Depends(get_user_id)):
    create_chat(user_id, me)
    return 200


@router.get("/chats")
def chats(chats=Depends(get_user_chats)):
    return chats


@router.get("/messages")
def messages(
        username: str,
        user_id=Depends(get_user_id), ):
    user1 = get_user_by_username(username)
    chat_id = get_chat(user1.id, user_id)
    if not chat_id:
        chat = create_chat(user1.id, user_id)
        chat_id = chat.id

    return get_messages(chat_id.id)


@router.post("/message")
def send_message(
        content: str,
        username: str,
        user_id=Depends(get_user_id)):
    user1_id = get_user_by_username(username)
    chat = get_chat(user1_id, user1_id)
    add_message(chat_id=chat.id, content=content, owner_id=user_id)
    return 200


@router.websocket("/ws/{username}")
async def websocket_chat(websocket: WebSocket,
                         username: str):
    await websocket.accept()
    access_token = (await websocket.receive_json())['access_token']
    data = decode_jwt(access_token)
    id = data["payload"]["id"]
    user = get_user_by_id(id)
    context = {"socket_owner": user.__dict__}
    if user.username == username:
        connections[user.username] = websocket
        try:
            await handle_messages(websocket, context)
        except Exception:
            await websocket.close()
