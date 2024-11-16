from fastapi import APIRouter, WebSocket
from services.cdp_service import get_or_create_wallet
from services.agent_manager import AgentManager

agent_router = APIRouter()
manager = AgentManager()


@agent_router.post("/user/{user_id}/create_wallet")
async def create_wallet(user_id: str):
    """Create a wallet for a user."""
    print("Creating wallet for user:", user_id)
    [wallet_data, wallet_address] = get_or_create_wallet(user_id)
    return {
        "wallet_data": wallet_data,
        "wallet_address": wallet_address,
        "user_id": user_id,
    }


@agent_router.post("/user/{user_id}/start")
async def start_agent(user_id: str):
    """Start an agent in a specified mode."""
    agent_executor, config = manager.initialize_agent(user_id)
    manager.start_agent(user_id, agent_executor, config)
    return {"message": f"Agent {user_id} started."}


@agent_router.post("/user/{user_id}/stop")
async def stop_agent(user_id: str):
    """Stop a running agent."""
    manager.stop_agent(user_id)
    return {"message": f"Agent {user_id} stopped."}


@agent_router.post("/user/{user_id}/new_message")
async def agent_chat(user_id: str, message: str):
    """Send a message to an agent."""
    agent_executor, config = manager.initialize_agent(user_id)
    manager.start_agent(user_id, mode, agent_executor, config)
    return {"message": f"Agent {user_id} started in {mode} mode."}
