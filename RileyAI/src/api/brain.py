import os
import json 
from groq import Groq
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

client = Groq() 
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

current_dir = Path(__file__).parent
json_path = current_dir / "src" / "sys_prompts.json"

@app.get("/think")
def think(user_query: str):
    print(f"User asked: {user_query}")
    print(f"Path to prompts: {json_path}")
    
    # Optional: How you would load the prompt from your JSON file
    with open(json_path, "r", encoding="utf-8") as f:
        prompts = json.load(f)
    # system_prompt = prompts["my_prompt_key"]
    print(json.dumps(prompts, indent=4))

    # 3. Move the Groq call inside the route so it only runs when requested
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "You are a concise, helpful assistant."
            },
            {
                "role": "user",
                "content": user_query,
            }
        ],
        model="llama3-8b-8192", 
    )

    return {
        "response": chat_completion.choices[0].message.content
    }