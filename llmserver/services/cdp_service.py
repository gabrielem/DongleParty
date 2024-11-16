from services.firebase_service import get_wallet_data_by_user, save_wallet_data
from cdp_langchain.utils import CdpAgentkitWrapper


def get_or_create_wallet(user_id: str):
    """Create a wallet for a user."""
    # Fetch wallet data from Firebase
    wallet_data = get_wallet_data_by_user(user_id)

    values = {"cdp_wallet_data": wallet_data} if wallet_data else {}
    agentkit = CdpAgentkitWrapper(**values)

    # Export wallet data and save it back to Firebase
    wallet_data = agentkit.export_wallet()
    wallet_address = save_wallet_data(user_id, wallet_data)

    return [wallet_data, wallet_address]
