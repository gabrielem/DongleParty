from http.client import HTTPException
from fastapi import APIRouter, WebSocket
from services.cdp_service import get_or_create_wallet
from services.agent_manager import AgentManager

agent_router = APIRouter()
manager = AgentManager()


@agent_router.post("/user/{user_id}/create_wallet")
async def create_wallet(user_id: str):
    """Create a wallet for a user."""
    [wallet_data, wallet_address] = get_or_create_wallet(user_id)

    return {
        "wallet_data": wallet_data,
        "wallet_address": wallet_address,
        "user_id": user_id,
    }


@agent_router.get("/user/{user_id}/wallet")
async def get_wallet(user_id: str):
    """Get a wallet for a user."""
    print("Creating wallet for user:", user_id)
    [wallet_data, wallet_address] = get_or_create_wallet(user_id)
    return {
        "wallet_address": wallet_address,
        "user_id": user_id,
    }


@agent_router.post("/user/{user_id}/stop")
async def stop_agent(user_id: str):
    """Stop a running agent."""
    manager.stop_agent(user_id)
    return {"message": f"Agent {user_id} stopped."}


from pydantic import BaseModel


class ChatMessage(BaseModel):
    message: str


@agent_router.post("/user/{user_id}/message")
async def send_message(user_id: str, message: ChatMessage):
    """Send a message to the agent and get a response."""
    try:
        response = manager.process_message(user_id, message.message)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
