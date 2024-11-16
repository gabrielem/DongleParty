import { BlockchainProviderConnector } from '@1inch/cross-chain-sdk';
import { EIP712TypedData } from '@1inch/limit-order-sdk';


export class CDPWalletProviderConnector implements BlockchainProviderConnector {
    private readonly walletAddress: string;
    constructor(walletAddress: string) {
        this.walletAddress = walletAddress;
    }
    signTypedData(_walletAddress: string, typedData: EIP712TypedData): Promise<string> {

        // Call llmserver to sign message, or directly invoke cdp sdk with exported wallet data
        return Promise.resolve('Stubbed: signTypedData - TODO');
    }

    ethCall(contractAddress: string, callData: string): Promise<string> {
        throw Error('Stubbed: ethCall - Not implemented');
    }
}