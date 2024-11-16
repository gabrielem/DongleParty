from cdp import Wallet
from cdp_langchain.tools import CdpTool
from lib.tools.approve_token import approve_token_allowance
from pydantic import BaseModel, Field
from web3 import Web3

SWAP_TOKEN_PROMPT = """
This tool swaps a specified amount of one token (tokenA) for another token (tokenB) on Uniswap V2 or V3.
Use this when a user specifies the input token, output token, and amount to swap. It supports optional slippage settings.
"""
UNISWAP_V2_ROUTER_CONTRACT_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
UNISWAP_V3_ROUTER_CONTRACT_ADDRESS = "0xE592427A0AEce92De3Edee1F18E0157C05861564"


class SwapTokenInput(BaseModel):
    """
    Input schema for the swap_token action.
    """

    tokenA: str = Field(
        ...,
        description="The address of the token to swap from (e.g., USDC).",
        example="0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    )
    tokenB: str = Field(
        ...,
        description="The address of the token to swap to (e.g., DAI).",
        example="0x6b175474e89094c44da98b954eedeac495271d0f",
    )
    amount: float = Field(
        ..., description="The amount of tokenA to swap.", example=100.0
    )
    slippage: float = Field(
        ..., description="The allowed slippage percentage for the swap.", example=0.5
    )
    use_v3: bool = Field(
        ...,
        description="Set to true to use Uniswap V3. If false, Uniswap V2 is used.",
        example=True,
    )


def swap_token(
    wallet: Wallet,
    tokenA: str,
    tokenB: str,
    amount: float,
    slippage: float,
    use_v3: bool,
) -> str:
    """
    Executes a token swap on Uniswap V2 or V3.

    Args:
        wallet (Wallet): The wallet to perform the swap.
        tokenA (str): Address of the token to swap from.
        tokenB (str): Address of the token to swap to.
        amount (float): Amount of tokenA to swap.
        slippage (float): Allowed slippage percentage.
        use_v3 (bool): Use Uniswap V3 if True; otherwise, use Uniswap V2.

    Returns:
        str: A transaction hash confirming the swap.
    """

    router_address = (
        UNISWAP_V3_ROUTER_CONTRACT_ADDRESS
        if use_v3
        else UNISWAP_V2_ROUTER_CONTRACT_ADDRESS
    )

    # Construct the transaction
    tokenA_address = Web3.to_checksum_address(tokenA)
    tokenB_address = Web3.to_checksum_address(tokenB)
    tokenA_contract = web3.eth.contract(address=tokenA_address, abi=get_token_abi())
    token_decimals = tokenA_contract.functions.decimals().call()
    amount_in_wei = int(amount * (10**token_decimals))

    # Approve token transfer
    approve_token_allowance(wallet, tokenA_address, router_address, amount_in_wei)
    approval_tx = tokenA_contract.functions.approve(
        router_address, amount_in_wei
    ).build_transaction(wallet.build_transaction())
    web3.eth.send_raw_transaction(wallet.sign_transaction(approval_tx))

    # Execute the swap
    deadline = int(web3.eth.get_block("latest")["timestamp"]) + 300
    if use_v3:
        tx = router.functions.exactInputSingle(
            {
                "tokenIn": tokenA_address,
                "tokenOut": tokenB_address,
                "fee": 3000,  # Fee tier for Uniswap V3
                "recipient": wallet.address,
                "deadline": deadline,
                "amountIn": amount_in_wei,
                "amountOutMinimum": int(amount_in_wei * (1 - slippage / 100)),
                "sqrtPriceLimitX96": 0,
            }
        ).build_transaction(wallet.build_transaction())
    else:
        tx = router.functions.swapExactTokensForTokens(
            amount_in_wei,
            int(amount_in_wei * (1 - slippage / 100)),
            [tokenA_address, tokenB_address],
            wallet.address,
            deadline,
        ).build_transaction(wallet.build_transaction())

    signed_tx = wallet.sign_transaction(tx)
    tx_hash = web3.eth.send_raw_transaction(signed_tx)

    return f"Transaction successful! Hash: {web3.to_hex(tx_hash)}"


def get_router_abi(use_v3: bool) -> list:
    """
    Get the ABI for the Uniswap router (V2 or V3).
    """
    if use_v3:
        # Load Uniswap V3 ABI
        return UNISWAP_V3_ROUTER_ABI
    else:
        # Load Uniswap V2 ABI
        return UNISWAP_V2_ROUTER_ABI


def get_token_abi() -> list:
    """
    Get the ABI for an ERC-20 token.
    """
    return ERC20_ABI  # Assume ERC-20 ABI is defined elsewhere.


swapTokenTool = CdpTool(
    name="swap_token",
    description=SWAP_TOKEN_PROMPT,
    cdp_agentkit_wrapper=agentkit,
    args_schema=SwapTokenInput,
    func=swap_token,
)
