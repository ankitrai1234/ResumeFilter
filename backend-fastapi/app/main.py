from fastapi import FastAPI
from .routers import resume_router, chatbot_router
from .services.qdrant_service import init_collection
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

from fastapi.staticfiles import StaticFiles



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
init_collection()

app.include_router(resume_router.router)
app.include_router(chatbot_router.router)