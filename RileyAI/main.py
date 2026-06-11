import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# router
from src.api.brain import router as brain_router

app = FastAPI()
app.include_router(brain_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def read_root():
    return {"status": "working"}

if __name__ == "__main__":
    # Assuming your file is named main.py. If it's named something else, 
    # change "main:app" to "yourfilename:app"
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)