wallet_router = APIRouter()


@wallet_router.post("/sign-typed-data")
async def sign_typed_data(wallet_address: str, typed_data: dict):
    """Signs EIP712 typed data."""

    return {"signature": sign_typed_data(wallet_address, typed_data)}


@wallet_router.post("/{wallet_address}/webhook")
async def handle_wallet_webhook(wallet_address: str, typed_data: dict):
    """Signs EIP712 typed data."""

    return {"signature": sign_typed_data(wallet_address, typed_data)}
