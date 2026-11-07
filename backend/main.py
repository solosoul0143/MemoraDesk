
import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from hindsight_client import Hindsight
from groq import Groq

# Load environment variables from .env
load_dotenv()

# Read configuration
api_key = os.getenv("HINDSIGHT_API_KEY")
base_url = os.getenv(
    "HINDSIGHT_BASE_URL",
    "https://api.hindsight.vectorize.io"
)
bank_id = os.getenv("HINDSIGHT_BANK_ID")

groq_key = os.getenv("GROQ_API_KEY")

# Validate configuration
if not api_key:
    raise ValueError("HINDSIGHT_API_KEY is missing from .env")

if not bank_id:
    raise ValueError("HINDSIGHT_BANK_ID is missing from .env")

if not groq_key:
    raise ValueError("GROQ_API_KEY is missing from .env")

# Initialize Hindsight and Groq clients
memory_client = Hindsight(
    base_url=base_url,
    api_key=api_key
)

groq_client = Groq(api_key=groq_key)

# Create FastAPI application
app = FastAPI(
    title="MemoraDesk API",
    description="AI Memory Assistant powered by Hindsight and Groq",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request models
class MemoryRequest(BaseModel):
    content: str


class RecallRequest(BaseModel):
    query: str


class ChatRequest(BaseModel):
    message: str


# Home endpoint
@app.get("/")
def home():
    return {
        "success": True,
        "message": "Welcome to MemoraDesk API"
    }


# Health check endpoint
@app.get("/health")
def health():
    return {
        "success": True,
        "status": "running",
        "service": "MemoraDesk API"
    }


# Save information to Hindsight
@app.post("/memory")
def save_memory(request: MemoryRequest):
    try:
        memory_client.retain(
            bank_id=bank_id,
            content=request.content
        )

        return {
            "success": True,
            "message": "Memory saved successfully",
            "content": request.content
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# Retrieve information from Hindsight
@app.post("/recall")
def recall_memory(request: RecallRequest):
    try:
        result = memory_client.recall(
            bank_id=bank_id,
            query=request.query
        )

        return {
            "success": True,
            "query": request.query,
            "memories": result
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# AI Chat endpoint
@app.post("/chat")
def chat(request: ChatRequest):
    try:
        # Retrieve relevant memories
        recall_result = memory_client.recall(
            bank_id=bank_id,
            query=request.message
        )

        # Convert recalled memories into text
        memories_used = []

        if isinstance(recall_result, dict):
            memories_used = recall_result.get("memories", [])
        elif isinstance(recall_result, list):
            memories_used = recall_result
        else:
            memories_used = [str(recall_result)]

        memory_context = "\n".join(
            str(memory) for memory in memories_used
        )

        # Prepare AI prompt
        system_prompt = f"""
You are MemoraDesk AI, an intelligent personal memory assistant.

Your responsibilities:
1. Answer questions clearly and helpfully.
2. Use the retrieved memories when relevant.
3. Remember that the user may refer to information shared earlier.
4. If the memory context does not contain an answer, be honest.
5. Never invent personal memories.

Retrieved memories:
{memory_context}
"""

        # Generate AI response using Groq
        completion = groq_client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": request.message
                }
            ],
            temperature=0.6,
            max_tokens=1024
        )

        answer = completion.choices[0].message.content

        # Store user message in Hindsight
        memory_client.retain(
            bank_id=bank_id,
            content=f"User said: {request.message}"
        )

        # Store AI response in Hindsight
        memory_client.retain(
            bank_id=bank_id,
            content=f"MemoraDesk AI responded: {answer}"
        )

        return {
            "success": True,
            "message": request.message,
            "memories_used": memories_used,
            "answer": answer
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
