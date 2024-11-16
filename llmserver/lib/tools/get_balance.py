from cdp import Wallet
from cdp_langchain.tools import CdpTool
from pydantic import BaseModel, Field

GET_BALANCE_PROMPT = """
This tool queries the token balances for a given wallet address.

Parameters:
- wallet_address: The Ethereum address to check balances for
"""


class GetBalanceInput(BaseModel):
    """Input argument schema for getting wallet balances."""

    wallet_address: str = Field(
        ...,
        description="The Ethereum address to check balances for",
        example="0x1234567890abcdef1234567890abcdef12345678",
    )


def get_wallet_balance(wallet_address: str) -> str:
    """
    Query token balances for a wallet address.

    Args:
        wallet_address (str): The Ethereum address to check balances for

    Returns:
        str: JSON string containing token balances
    """
    try:
        print(f"[Tool called] get_wallet_balance, wallet_address: {wallet_address}")

        # TODO: Implement balance API call here
        # This is a placeholder that should be replaced with actual API integration
        balances = {"eth": "0.0", "tokens": []}

        return str(balances)

    except Exception as e:
        print(f"Error getting wallet balance: {e!s}")
        return f"Error getting wallet balance: {e!s}"


def buildGetBalanceTool(agentkit):
    getBalanceTool = CdpTool(
        name="get_wallet_balance",
        description=GET_BALANCE_PROMPT,
        cdp_agentkit_wrapper=agentkit,
        args_schema=GetBalanceInput,
        func=get_wallet_balance,
    )
    return getBalanceTool
