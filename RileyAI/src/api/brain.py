import os
import json
from groq import AsyncGroq
from pathlib import Path
from fastapi import APIRouter, HTTPException
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import List

# types
from src.types.project import Project 

load_dotenv() 

client = AsyncGroq() 
router = APIRouter()

# Use .resolve() to ensure it builds an absolute, bulletproof path
current_dir = Path(__file__).parent.resolve()

# sys prompts
thinking_prompt_path = current_dir / "../sys_prompts/thinking.md"

class UserQuery(BaseModel):
    query: str
    all_user_projects: List[Project] # must pass all the project for future context or reference 
    active_project: Project # know the active project the use is chatting with ai 

@router.post("/think")
async def think(user_query: UserQuery):
    print(f"User asked: {user_query.query}")
    print(f"all the projects are -> : {user_query.all_user_projects}")
    print(f"active project is -> : {user_query.active_project}")
    
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



        # -> Extract the tools Here <--
        # ->        json_data       <--
        # -> Extract the tools Here <--



        return {"response": json_data}
        
    except Exception as e:
        print(f"Groq API Error: {e}")
        raise HTTPException(status_code=500, detail="Error generating AI response.")