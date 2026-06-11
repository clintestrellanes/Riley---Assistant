import uvicorn
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"status": "working"}

if __name__ == "__main__":
    # Assuming your file is named main.py. If it's named something else, 
    # change "main:app" to "yourfilename:app"
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)