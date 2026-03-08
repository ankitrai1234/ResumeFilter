from pydantic import BaseModel

class ResumeResponse(BaseModel):

    message: str


class ChatRequest(BaseModel):

    question: str


class ChatResponse(BaseModel):

    answer: str