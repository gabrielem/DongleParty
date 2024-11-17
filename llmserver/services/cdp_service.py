import json
import os
from services.firebase_service import (
    get_wallet_data_by_address,
    get_wallet_data_by_user,
    save_wallet_data,
)

from cdp_langchain.utils import CdpAgentkitWrapper

from cdp import Wallet, WalletData

from dotenv import load_dotenv

load_dotenv()

webhookURL = os.getenv("WALLET_WEBHOOK_URL")


def get_or_create_wallet(user_id: str):
    """Create a wallet for a user."""
    # Fetch wallet data from Firebase

    network_id = os.getenv("NETWORK_ID")
    print(f"Network ID: {network_id}")

    wallet_data = get_wallet_data_by_user(user_id)

    values = {"cdp_wallet_data": wallet_data} if wallet_data else {}
    agentkit = CdpAgentkitWrapper(**values)

    # Export wallet data and save it back to Firebase
    wallet_data = agentkit.export_wallet()
    wallet_address = save_wallet_data(user_id, wallet_data, network_id)

    return [wallet_data, wallet_address]
