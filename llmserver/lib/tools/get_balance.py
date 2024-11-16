from cdp import Wallet
from cdp_langchain.tools import CdpTool
from pydantic import BaseModel, Field
from decimal import Decimal
import requests

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
        str: string array token balances in the format of "Token Name (Symbol): Balance"
    """
    try:
        print(f"[Tool called] get_wallet_balance, wallet_address: {wallet_address}")

        balances = get_1inch_balances(wallet_address)

        # filtered_balances = list(filter(lambda x: int(x["balance"]) > 0, balances))
        formatted_lines = map(
            lambda x: f"{x['name']} ({x['symbol']}): {Decimal(x['balance']) / (Decimal(10)** Decimal(x['decimals']))}",
            balances,
        )

        formatted_balances = "\n".join(formatted_lines)
        return f"Balances for wallet {wallet_address}:\n{formatted_balances}"

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


def get_1inch_balances(wallet_address: str) -> str:
    url = f"https://dongle-party.vercel.app/api/getBalances"
    data = {"address": wallet_address}
    response = requests.post(url, json=data)
    data = response.json()

    return data
