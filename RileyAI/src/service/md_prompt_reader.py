from fastapi import HTTPException
from pathlib import Path

async def prompt_reader(file_path: Path):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        return content

    except FileNotFoundError:
        raise HTTPException(
            status_code=500, detail=f"System prompt file not found at: {file_path}"
        )
