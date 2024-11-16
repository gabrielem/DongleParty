from cdp import Wallet, hash_message
from cdp_langchain.tools import CdpTool
from pydantic import BaseModel, Field

# Define a custom action exmaple.

SIGN_MESSAGE_PROMPT = """
This tool will wrap native ETH into an erc20 token WETH.
"""


class SignMessageInput(BaseModel):
    """Input argument schema for sign message action."""

    message: str = Field(..., description="The message to sign. e.g. `hello world`")


def sign_message(wallet: Wallet, message: str) -> str:
    """Sign message using EIP-191 message hash from the wallet.

    Args:
        wallet (Wallet): The wallet to sign the message from.
        message (str): The message to hash and sign.

    Returns:
        str: The message and corresponding signature.

    """
    payload_signature = wallet.sign_payload(hash_message(message)).wait()

    return f"The payload signature {payload_signature}"


def buildSignMessageTool(agentkit):
    """Initialize the agent with CDP Agentkit."""
    # TODO: Load the LLM model and CDP Agentkit values from the environment.

    # Define a new tool for signing messages.
    signMessageTool = CdpTool(
        name="sign_message",
        description=SIGN_MESSAGE_PROMPT,
        cdp_agentkit_wrapper=agentkit,
        args_schema=SignMessageInput,
        func=sign_message,
    )

    return signMessageTool
