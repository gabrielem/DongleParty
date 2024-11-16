from langchain_openai import ChatOpenAI
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import create_react_agent
from cdp_langchain.agent_toolkits import CdpToolkit
from cdp_langchain.utils import CdpAgentkitWrapper
from services.firebase_service import get_wallet_data_by_user

wallet_data_file = "wallet_data.txt"


def initialize_agent(user_id: str):
    """Initialize the CDP Agent and store wallet data in Firebase."""
    llm = ChatOpenAI(model="gpt-4o-mini")

    wallet_data = get_wallet_data_by_user(user_id)

    if wallet_data is None:
        raise Exception("Wallet data not found")

    values = {"cdp_wallet_data": wallet_data} if wallet_data else {}
    agentkit = CdpAgentkitWrapper(**values)

    # Initialize CDP Agentkit tools
    cdp_toolkit = CdpToolkit.from_cdp_agentkit_wrapper(agentkit)
    tools = cdp_toolkit.get_tools()

    # Store buffered conversation history in memory
    # TODO: Add persistent to memory
    memory = MemorySaver()
    config = {"configurable": {"thread_id": f"CDP Agentkit Chatbot for {user_id}"}}

    return (
        create_react_agent(
            llm,
            tools=tools,
            checkpointer=memory,
            state_modifier="You are a helpful agent that can interact onchain using the Coinbase Developer Platform Agentkit.",
        ),
        config,
    )
