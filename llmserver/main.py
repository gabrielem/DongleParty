from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from routers.agents import agent_router
from services.agent_manager import AgentManager
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add routers
app.include_router(agent_router)


# Root endpoint
@app.get("/")
async def root():
    return {"message": "CDP Agent FastAPI server is running!"}
