import os
import json
from groq import AsyncGroq
from pathlib import Path
from fastapi import APIRouter, HTTPException
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv() 

client = AsyncGroq() 
router = APIRouter()

# Use .resolve() to ensure it builds an absolute, bulletproof path
current_dir = Path(__file__).parent.resolve()

# sys prompts
thinking_prompt_path = current_dir / "../sys_prompts/thinking.md"

class UserQuery(BaseModel):
    query: str

@router.post("/think")
async def think(user_query: UserQuery):
    print(f"User asked: {user_query.query}")
    
    # 1. READ SYSTEM PROMPT
    try:
        with open(thinking_prompt_path, "r", encoding="utf-8") as f:
            system_prompt_content = f.read()
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="System prompt file not found.")

    try:
        chat_completion = await client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": system_prompt_content + "\n\nCRITICAL: You must respond ONLY in valid JSON format." 
                },
                {
                    "role": "user",
                    "content": user_query.query,
                }
            ],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"} 
        )
        
        response_text = chat_completion.choices[0].message.content
        print("Raw Chat completion:", response_text)
        
        try:
            json_data = json.loads(response_text)
        except json.JSONDecodeError:
            print("Failed to parse JSON. Raw output:", response_text)
            raise HTTPException(status_code=500, detail="AI did not return valid JSON.")
        
        return {"response": json_data}
        
    except Exception as e:
        print(f"Groq API Error: {e}")
        raise HTTPException(status_code=500, detail="Error generating AI response.")