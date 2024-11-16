import { BlockchainProviderConnector } from '@1inch/cross-chain-sdk';
import { EIP712TypedData } from '@1inch/limit-order-sdk';



const walletServer = process.env.LLM_SERVER_URL;

async function remoteSignTypedData(walletAddress: string, typedData: EIP712TypedData) {
    const response = await fetch(`${walletServer}/sign-typed-data`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ wallet_address: walletAddress, typed_data: typedData })
    });

    const data = await response.json();
    return data.signature;
}


export class CDPWalletProviderConnector implements BlockchainProviderConnector {
    private readonly walletAddress: string;
    constructor(walletAddress: string) {
        this.walletAddress = walletAddress;
    }

    signTypedData(_walletAddress: string, typedData: EIP712TypedData): Promise<string> {
        console.log("Signing typed data", _walletAddress, typedData)
        // Call llmserver to sign message, or directly invoke cdp sdk with exported wallet data
        return remoteSignTypedData(this.walletAddress, typedData);
    }

    ethCall(contractAddress: string, callData: string): Promise<string> {
        throw Error('Stubbed: ethCall - Not implemented');
    }
}