from fastapi import APIRouter, UploadFile, File
import uuid
import os

from ..services.pdf_service import extract_text_from_pdf
from ..services.text_splitter import split_text
from ..services.embedding_service import create_embedding
from ..services.qdrant_service import store_chunks

router = APIRouter(prefix="/api/resumes")

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):

    file_id = str(uuid.uuid4())
    file_path = f"{UPLOAD_DIR}/{file_id}.pdf"

    with open(file_path, "wb") as f:
        f.write(await file.read())

    text = extract_text_from_pdf(file_path)

    chunks = split_text(text)

    chunk_data = []

    for chunk in chunks:

        embedding = create_embedding(chunk)

        chunk_data.append({
            "text": chunk,
            "embedding": embedding
        })

    store_chunks(chunk_data)

    return {"message": "Resume indexed successfully"}