from fastapi import APIRouter
from ..schemas import ChatRequest
from ..services.embedding_service import create_embedding
from ..services.qdrant_service import search_chunks
from ..services.llm_service import generate_answer

router = APIRouter(prefix="/api/chatbot")


@router.post("/")
def chatbot(request: ChatRequest):

    question = request.question

    query_embedding = create_embedding(question)

    chunks = search_chunks(query_embedding)

    context = "\n\n".join(chunks)

    answer = generate_answer(question, context)

    return {"answer": answer}