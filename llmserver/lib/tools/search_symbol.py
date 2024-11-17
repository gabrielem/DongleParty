from cdp import Wallet
from cdp_langchain.tools import CdpTool
from pydantic import BaseModel, Field
import json
import requests

SEARCH_SYMBOL_PROMPT = """
This tool searches for token contract addresses on Base mainnet given a token symbol.

Parameters:
- symbol: The token symbol to search for (e.g. "ETH", "USDC")
"""


class SearchSymbolInput(BaseModel):
    """Input argument schema for token symbol search."""

    symbol: str = Field(
        ...,
        description="The token symbol to search for",
        example="ETH",
    )


def search_symbol(symbol: str) -> str:
    """
    Search for token contract addresses matching a symbol on Base mainnet.

    Args:
        symbol (str): The token symbol to search for

    Returns:
        str: JSON string containing up to 3 matching token addresses
    """
    try:
        print(f"[Tool called] search_symbol, symbol: {symbol}")

        matches = dexscreener_symbol_search(symbol)

        # Format response with top 3 matches
        results = []
        for match in matches[:3]:
            base_token = match.get("baseToken", {})
            results.append(
                {
                    "name": base_token.get("name"),
                    "symbol": base_token.get("symbol"),
                    "address": base_token.get("address"),
                    "liquidity_usd": match.get("liquidity", {}).get("usd", 0),
                }
            )

        print(results)

        return json.dumps(results)

    except Exception as e:
        print(f"Error searching symbol: {e!s}")
        return f"Error searching symbol: {e!s}"


def buildSearchSymbolTool(agentkit):
    searchSymbolTool = CdpTool(
        name="search_symbol",
        description=SEARCH_SYMBOL_PROMPT,
        cdp_agentkit_wrapper=agentkit,
        args_schema=SearchSymbolInput,
        func=search_symbol,
    )
    return searchSymbolTool


def dexscreener_symbol_search(symbol: str) -> list:
    """
    Search DexScreener API for tokens matching the given symbol.
    Returns list of pairs filtered by liquidity and chain.
    """
    url = f"https://api.dexscreener.com/latest/dex/search?q={symbol}"
    response = requests.get(url)
    data = response.json()

    # Filter for Base mainnet pairs with significant liquidity
    pairs = data.get("pairs", [])
    filtered_pairs = [
        pair
        for pair in pairs
        if pair.get("chainId") == "base"
        and pair.get("liquidity", {}).get("usd", 0) > 10000
    ]

    # Sort by liquidity
    return sorted(
        filtered_pairs,
        key=lambda x: float(x.get("liquidity", {}).get("usd", 0)),
        reverse=True,
    )
