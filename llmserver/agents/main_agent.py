from langchain_openai import ChatOpenAI
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import create_react_agent
from cdp_langchain.agent_toolkits import CdpToolkit
from cdp_langchain.utils import CdpAgentkitWrapper
from langchain_core.messages import HumanMessage
from services.firebase_service import get_wallet_data_by_user

from lib.tools.approve_token import buildApproveTokenTool
from lib.tools.analyse_token import buildAnalyseTokenTool
from lib.tools.get_balance import buildGetBalanceTool
from lib.tools.search_symbol import buildSearchSymbolTool


def initialize_agent(user_id: str):
    """Initialize the CDP Agent and store wallet data in Firebase."""
    llm = ChatOpenAI(model="gpt-4o")

    wallet_data = get_wallet_data_by_user(user_id)

    if wallet_data is None:
        raise Exception("Wallet data not found")

    values = {"cdp_wallet_data": wallet_data} if wallet_data else {}
    agentkit = CdpAgentkitWrapper(**values)

    # Initialize CDP Agentkit tools
    cdp_toolkit = CdpToolkit.from_cdp_agentkit_wrapper(agentkit)
    default_tools = cdp_toolkit.get_tools()
    # Only take tools with names [transfer, get_wallet_details,get_balance,trade]
    tools = [
        tool
        for tool in default_tools
        if tool.name in ["transfer", "get_wallet_details", "trade"]
    ]

    approval_tool = buildApproveTokenTool(agentkit)
    analyse_token_tool = buildAnalyseTokenTool(agentkit)
    get_balance_tool = buildGetBalanceTool(agentkit)
    search_symbol_tool = buildSearchSymbolTool(agentkit)

    tools.append(approval_tool)
    tools.append(analyse_token_tool)
    tools.append(get_balance_tool)
    tools.append(search_symbol_tool)
    print("Enabled tools:")
    for tool in tools:
        print(tool.name)

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


def handle_message(agent, config, message: str):
    """Process a user message synchronously with the agent."""
    input_message = HumanMessage(content=message)
    result = agent.invoke({"messages": [input_message]}, config)

    return result["messages"][-1].content
