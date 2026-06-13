import json

from fastapi import HTTPException
from pydantic import BaseModel

# ==== Types ==== #
from src.types.ai import Tools


# ==== Types ==== #
async def jsonify(data_str: str, ExpectedModel: type[BaseModel]):
    try:
        # 2. Parse string into a Python dictionary
        json_data = json.loads(data_str)

        # 3. Convert the dictionary into your Pydantic model
        # This is required so Brain_Processing can use dot notation (tool.id)
        ai_response_model = ExpectedModel(**json_data)
        return ai_response_model
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI did not return valid JSON.")
    except Exception as e:
        # This will catch if the JSON doesn't match your Pydantic schema
        print("Pydantic Validation Error:", e)
        raise HTTPException(status_code=500, detail="AI response did not match schema.")
