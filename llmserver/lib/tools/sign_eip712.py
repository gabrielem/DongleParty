from cdp import Wallet, hash_message
from cdp_langchain.tools import CdpTool
from pydantic import BaseModel, Field

# Define a custom action exmaple.

SIGN_MESSAGE_PROMPT = """
This tool will sign EIP-712 typed messages using the wallet.
"""


class SignEIP712MessageInput(BaseModel):
    """Input argument schema for signing EIP-712 typed data."""

    message: str = Field(
        ..., description="The EIP-712 typed data to sign. e.g. `hello world`"
    )


def sign_typed_data(wallet: Wallet, typed_data: dict) -> str:
    """Sign EIP-712 typed data using the wallet.

    Args:
        wallet (Wallet): The wallet to sign the message from.
        typed_data (dict): The EIP-712 typed data to sign.

    Returns:
        str: The message and corresponding signature.

    """
    payload_signature = wallet.sign_payload(hash_typed_data_message(typed_data)).wait()

    return f"The payload signature {payload_signature}"


def initialize_agent():
    """Initialize the agent with CDP Agentkit."""
    # TODO: Load the LLM model and CDP Agentkit values from the environment.

    agentkit = CdpAgentkitWrapper(**values)

    # Initialize CDP Agentkit Toolkit and get tools.
    cdp_toolkit = CdpToolkit.from_cdp_agentkit_wrapper(agentkit)
    tools = cdp_toolkit.get_tools()

    # Define a new tool for signing messages.
    signMessageTool = CdpTool(
        name="sign_message",
        description=SIGN_MESSAGE_PROMPT,
        cdp_agentkit_wrapper=agentkit,
        args_schema=SignMessageInput,
        func=sign_message,
    )

    all_tools = tools.append(signMessageTool)

    # Store buffered conversation history in memory.
    memory = MemorySaver()
    config = {"configurable": {"thread_id": "CDP Agentkit Chatbot Example!"}}

    # Create ReAct Agent using the LLM and CDP Agentkit tools.
    return (
        create_react_agent(
            llm,
            tools=all_tools,
            checkpointer=memory,
            state_modifier="You are a helpful agent that can interact onchain on the Base Layer 2 using the Coinbase Developer Platform Agentkit. You are empowered to interact onchain using your tools. If you ever need funds, you can request them from the faucet. You can also deploy your own ERC-20 tokens, NFTs, and interact with them. You also have the ability to sign messages using your wallet.",
        ),
        config,
    )
