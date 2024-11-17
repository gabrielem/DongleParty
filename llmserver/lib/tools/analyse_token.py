from cdp import Wallet
from cdp_langchain.tools import CdpTool
from pydantic import BaseModel, Field
import json
import requests

ANALYSE_TOKEN_PROMPT = """
This tool analyzes an ERC-20 token by querying various data sources to get information about:
- Token price and market data
- Social media mentions and sentiment
- On-chain metrics like holder count

Parameters:
- tokenAddress: The address of the ERC-20 token contract to analyze
"""


class AnalyseTokenInput(BaseModel):
    """Input argument schema for token analysis."""

    tokenAddress: str = Field(
        ...,
        description="The address of the ERC-20 token contract to analyse",
        example="0x1234567890abcdef1234567890abcdef12345678",
    )


def analyse_token(tokenAddress: str) -> str:
    """
    Analyse an ERC-20 token by querying various data sources.

    Args:
        tokenAddress (str): The address of the ERC-20 token contract

    Returns:
        str: JSON string containing analysis results
    """
    try:
        print(f"[Tool called] analyze_token, tokenAddress: {tokenAddress}")

        dexscreener_data = dexscreener_token_data(tokenAddress)

        return json.dumps(dexscreener_data)

    except Exception as e:
        print(f"Error analyzing token: {e!s}")
        return f"Error analyzing token: {e!s}"


def buildAnalyseTokenTool(agentkit):
    analyseTokenTool = CdpTool(
        name="analyse_token",
        description=ANALYSE_TOKEN_PROMPT,
        cdp_agentkit_wrapper=agentkit,
        args_schema=AnalyseTokenInput,
        func=analyse_token,
    )
    return analyseTokenTool


def dexscreener_token_data(tokenAddress: str) -> str:
    """
        {
      "schemaVersion": "1.0.0",
      "pairs": [
        {
          "chainId": "base",
          "dexId": "uniswap",
          "url": "https://dexscreener.com/base/0x717358a47ac99f3cd233e723be331756b3951164",
          "pairAddress": "0x717358A47AC99f3Cd233e723be331756b3951164",
          "labels": [
            "v3"
          ],
          "baseToken": {
            "address": "0x0fD7a301B51d0A83FCAf6718628174D527B373b6",
            "name": "luminous",
            "symbol": "LUM"
          },
          "quoteToken": {
            "address": "0x4200000000000000000000000000000000000006",
            "name": "Wrapped Ether",
            "symbol": "WETH"
          },
          "priceNative": "0.01512",
          "priceUsd": "47.95",
          "txns": {
            "m5": {
              "buys": 3,
              "sells": 5
            },
            "h1": {
              "buys": 129,
              "sells": 110
            },
            "h6": {
              "buys": 1820,
              "sells": 721
            },
            "h24": {
              "buys": 11337,
              "sells": 3313
            }
          },
          "volume": {
            "h24": 9325126.17,
            "h6": 1715449.42,
            "h1": 233302.12,
            "m5": 1831.33
          },
          "priceChange": {
            "m5": -0.08,
            "h1": -7.74,
            "h6": -7.43,
            "h24": -11.31
          },
          "liquidity": {
            "usd": 2679434.94,
            "base": 43135,
            "quote": 192.7415
          },
          "fdv": 47952262,
          "marketCap": 47952262,
          "pairCreatedAt": 1731103851000,
          "info": {
            "imageUrl": "https://dd.dexscreener.com/ds-data/tokens/base/0x0fd7a301b51d0a83fcaf6718628174d527b373b6.png?key=9738f4",
            "header": "https://dd.dexscreener.com/ds-data/tokens/base/0x0fd7a301b51d0a83fcaf6718628174d527b373b6/header.png?key=9738f4",
            "openGraph": "https://cdn.dexscreener.com/token-images/og/base/0x0fd7a301b51d0a83fcaf6718628174d527b373b6?timestamp=1731786300000",
            "websites": [
              {
                "label": "Website",
                "url": "https://warpcast.com/aethernet/0x9b64c883"
              },
              {
                "label": "Warpcast",
                "url": "https://warpcast.com/~/channel/lum"
              }
            ],
            "socials": [
              {
                "type": "twitter",
                "url": "https://x.com/luminousbase"
              }
            ]
          }
        }
      ]
    }
    """
    url = f"https://api.dexscreener.com/latest/dex/tokens/{tokenAddress}"
    response = requests.get(url)
    data = response.json()

    return list(
        filter(
            lambda pair: pair.get("liquidity", {}).get("usd", 0) > 10000,
            data.get("pairs", []),
        )
    )
