from pathlib import Path

from dotenv import load_dotenv
from groq import AsyncGroq
from pydantic.main import BaseModel
from src.service.jsonify import jsonify

# ============ Service Here ============ #
from src.service.md_prompt_reader import prompt_reader

# ============ Service Here ============ #


load_dotenv()
client = AsyncGroq()


async def InvokeNeuron(
    user_query: str, sys_prompt: str, expected_model: type[BaseModel]
):
    print("========= NEURON WORKING HAHAHA ========")
    print(sys_prompt)
    print(user_query)
    # 1. READ SYSTEM PROMPT

    chat_completion = await client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": sys_prompt
                + "\n\nCRITICAL: You must respond ONLY in valid JSON format.",
            },
            {"role": "user", "content": user_query},
        ],
        model="llama-3.3-70b-versatile",
        response_format={"type": "json_object"},
    )

    response_text = chat_completion.choices[0].message.content
    print("Raw Chat completion:", response_text)
    json_res = await jsonify(response_text, expected_model)
    print("JSON ==> ", json_res)
    return json_res
