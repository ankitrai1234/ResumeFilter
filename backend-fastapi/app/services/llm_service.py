import os
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint

from dotenv import load_dotenv


load_dotenv()


token = os.getenv("HUGGINGFACEHUB_API_TOKEN")



llm = HuggingFaceEndpoint(
    repo_id="meta-llama/Llama-3.1-8B-Instruct",
    huggingfacehub_api_token=token,
    temperature=0.5,
    max_new_tokens=512,
)

chat = ChatHuggingFace(llm=llm)


def generate_answer(question, context):

    prompt = f"""
You are a recruiter assistant.

Answer ONLY using the resume information.

Context:
{context}

Question:
{question}

Answer:
"""

    response = chat.invoke(prompt)

    return response.content