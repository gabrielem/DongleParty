import { SDK, HashLock, SupportedChain } from "@1inch/cross-chain-sdk";
import { solidityPackedKeccak256, randomBytes } from 'ethers';
import { CDPWalletProviderConnector } from "./cdp-wallet";
require("dotenv").config();

// TODO write formal bug for this function being inaccessible
function getRandomBytes32() {
    // for some reason the cross-chain-sdk expects a leading 0x and can't handle a 32 byte long hex string
    return '0x' + Buffer.from(randomBytes(32)).toString('hex');
}

const devPortalApiKey = process.env.ONE_INCH_PORTAL_KEY

// Validate environment variables
if (!devPortalApiKey) {
    throw new Error("Missing required environment variables. Please check your .env file.");
}

export async function createTradeOrder(walletAddress: string, srcChainId: SupportedChain, dstChainId: SupportedChain, srcTokenAddress: string, dstTokenAddress: string, amount: string) {

    const blockchainProvider = new CDPWalletProviderConnector(walletAddress);

    const sdk = new SDK({
        url: 'https://api.1inch.dev/fusion-plus',
        authKey: devPortalApiKey,
        blockchainProvider
    });


    // const approveABI = [{ "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }];

    // Approval is only required once! make sure to add logic to check allowance and approve only if needed
    // TODO: run approval via llmserver or pre-approval in llmserver

    // const tkn = new Contract(srcTokenAddress, approveABI);
    // let allowance = await tkn.allowance(makerAddress, '0x111111125421ca6dc452d289314280a0f8842a65')
    // await tkn.approve(
    //     '0x111111125421ca6dc452d289314280a0f8842a65', // aggregation router v6
    //     (2n ** 256n - 1n) // unlimited allowance
    // );



    const invert = false //true;

    if (invert) {
        const temp = srcChainId;
        srcChainId = dstChainId;
        dstChainId = temp;

        const tempAddress = srcTokenAddress;
        srcTokenAddress = dstTokenAddress;
        dstTokenAddress = tempAddress;
    }

    const params = {
        srcChainId,
        dstChainId,
        srcTokenAddress,
        dstTokenAddress,
        amount: amount,
        enableEstimate: true,
        walletAddress: walletAddress
    };


    const quote = await sdk.getQuote(params);

    const secretsCount = quote.getPreset().secretsCount;

    const secrets = Array.from({ length: secretsCount }).map(() => getRandomBytes32());
    const secretHashes = secrets.map(x => HashLock.hashSecret(x));

    const hashLock = secretsCount === 1
        ? HashLock.forSingleFill(secrets[0])
        : HashLock.forMultipleFills(
            secretHashes.map((secretHash, i) =>
                solidityPackedKeccak256(['uint64', 'bytes32'], [i, secretHash.toString()]) as any // MerkleLeaf type not exported
            )
        );

    console.log("Received Fusion+ quote from 1inch API")

    const quoteResponse = await sdk.placeOrder(quote, {
        walletAddress: walletAddress,
        hashLock,
        secretHashes
    });

    const orderHash = quoteResponse.orderHash;

    console.log(`Order successfully placed`);

    const intervalId = setInterval(() => {
        console.log(`Polling for fills until order status is set to "executed"...`);
        sdk.getOrderStatus(orderHash).then(order => {
            if (order.status === 'executed') {
                console.log(`Order is complete. Exiting.`);
                clearInterval(intervalId);
            }
        }
        ).catch(error =>
            console.error(`Error: ${JSON.stringify(error, null, 2)}`)
        );

        sdk.getReadyToAcceptSecretFills(orderHash)
            .then((fillsObject) => {
                if (fillsObject.fills.length > 0) {
                    fillsObject.fills.forEach(fill => {
                        sdk.submitSecret(orderHash, secrets[fill.idx])
                            .then(() => {
                                console.log(`Fill order found! Secret submitted: ${JSON.stringify(secretHashes[fill.idx], null, 2)}`);
                            })
                            .catch((error) => {
                                console.error(`Error submitting secret: ${JSON.stringify(error, null, 2)}`);
                            });
                    });
                }
            })
            .catch((error) => {
                console.error(`Error getting ready to accept secret fills: ${error}`);
            });
    }, 5000);
}