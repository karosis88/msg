from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from auth.dependencies import get_user_id
from auth.router import router as auth_router
from chat.router import router as chat_router
from fastapi.exceptions import RequestValidationError
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi import WebSocket

from chat.service import handle_messages

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_headers=["*"],
    allow_methods=["*"],
    allow_credentials=True
)

app.include_router(prefix="/auth",
                   router=auth_router,
                   tags=["Auth"])
app.include_router(prefix="/chat",
                   router=chat_router,
                   tags=["Chat"])


@app.exception_handler(RequestValidationError)
def validation_handler(request: Request, exc: RequestValidationError):
    detail = exc.errors()[0]
    return JSONResponse(
        status_code=422,
        content={"detail": {detail["loc"][-1]: detail["msg"]}}
    )



@app.get("/")
async def root():
    return {"message": "Hello World"}
