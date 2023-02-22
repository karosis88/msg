from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth.router import router as auth_router
from chat.router import router as chat_router

app = FastAPI()

origins = [
    "http://localhost:3000"
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


@app.get("/")
async def root():
    return {"message": "Hello World"}
