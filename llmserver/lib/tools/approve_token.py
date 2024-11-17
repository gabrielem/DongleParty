from cdp import Wallet
from cdp_langchain.tools import CdpTool
from pydantic import BaseModel, Field

APPROVE_TOKEN_PROMPT = """
This tool approves an ERC-20 token allowance for a specific spender to MAX_INT. 
Use this when a user wants to authorize a spender to manage all tokens of a specified ERC-20 token.

Parameters:
- tokenAddress: The address of the ERC-20 token contract.
- spenderAddress: The address of the spender to grant allowance.
- NETWORK_ID: The network ID indicating which Ethereum network to operate on (e.g., 'base-mainnet', 'arbitrum-mainnet').
"""


class ApproveTokenInput(BaseModel):
    """Input argument schema for approving token allowance action."""

    tokenAddress: str = Field(
        ...,
        description="The address of the ERC-20 token contract.",
        example="0x1234567890abcdef1234567890abcdef12345678",
    )
    spenderAddress: str = Field(
        ...,
        description="The address of the spender to grant allowance.",
        example="0xabcdef1234567890abcdef1234567890abcdef12",
    )
    NETWORK_ID: str = Field(
        ...,
        description="The network ID indicating which Ethereum network to operate on (e.g., 'base-mainnet', 'arbitrum-mainnet').",
        example="base-mainnet",
    )


def approve_token_allowance(
    wallet: Wallet, tokenAddress: str, spenderAddress: str, NETWORK_ID: str
) -> str:
    """
    Approve ERC-20 token allowance to MAX_INT for a specified spender.

    Args:
        wallet (Wallet): The wallet initiating the transaction.
        tokenAddress (str): The address of the ERC-20 token contract.
        spenderAddress (str): The address of the spender to grant allowance.
        NETWORK_ID (str): The network ID for transaction execution.

    Returns:
        str: Transaction hash of the approval operation.
    """
    try:
        print(
            f"[Tool called] approve_token_allowance, tokenAddress: {tokenAddress}, spenderAddress: {spenderAddress}, NETWORK_ID: {NETWORK_ID}"
        )
        # Constants
        MAX_INT = 2**256 - 1

        ERC20_ABI = [
            {
                "constant": False,
                "inputs": [
                    {"name": "_spender", "type": "address"},
                    {"name": "_value", "type": "uint256"},
                ],
                "name": "approve",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": False,
                "stateMutability": "nonpayable",
                "type": "function",
            }
        ]

        if wallet.network_id != NETWORK_ID:
            return "Wallet network does not match the network ID provided."

        # Sign and send transaction

        invocation = wallet.invoke_contract(
            contract_address=tokenAddress,
            method="approve",
            abi=ERC20_ABI,
            args={"_spender": spenderAddress, "_value": f"{MAX_INT}"},
        ).wait()
    except Exception as e:
        print(f"Error approving token allowance {e!s}")
        return f"Error approving token allowance {e!s}"

    return f"Approval transaction sent. Hash: {invocation.transaction.transaction_hash}"


def buildApproveTokenTool(agentkit):
    approveTokenTool = CdpTool(
        name="approve_token_allowance",
        description=APPROVE_TOKEN_PROMPT,
        cdp_agentkit_wrapper=agentkit,  # Replace with actual CdpAgentkitWrapper instance
        args_schema=ApproveTokenInput,
        func=approve_token_allowance,
    )
    return approveTokenTool
