import os
import firebase_admin
from firebase_admin import credentials, db
from dotenv import load_dotenv
import json

load_dotenv()

# Initialize Firebase
cred = credentials.Certificate(".firebase_key.json")

database_url = os.getenv("FIREBASE_DATABASE_URL")

firebase_admin.initialize_app(cred, {"databaseURL": database_url})
# Get a reference to the database
ref = db.reference("/wallets")  # This refers to the root of your database


def save_wallet_data(user_id: str, wallet_data: str):
    """Save wallet data to Firestore, namespaced by userId."""
    print("Saving wallet data to Firebase")

    wallet_data = json.loads(wallet_data)
    print(wallet_data)
    wallet_address = wallet_data.get("default_address_id")
    ref.child("user_id").child(user_id).set({"wallet": wallet_data, "user_id": user_id})
    ref.child("wallet_address").child(wallet_address).set(
        {"wallet": wallet_data, "user_id": user_id}
    )

    return wallet_address


def get_wallet_data_by_user(user_id: str):
    """Retrieve wallet data for a specific userId."""
    doc = ref.child("user_id").child(user_id).get()
    if doc:
        return doc.get("wallet")
    return None


def get_wallet_data_by_address(wallet_address: str):
    """Retrieve wallet data for a specific wallet address."""
    doc = ref.child("wallet_address").child(wallet_address).get()
    if doc:
        return doc.get("wallet")
    return None
