import { FastifyReply, FastifyRequest } from "fastify";
import { OneInchTradeInput } from "./trade.schema";
import { createTradeOrder } from "../../lib/1inch";
import { NetworkEnum, SupportedChain, SupportedChains } from "@1inch/cross-chain-sdk";

export async function handleOneInchTrade(request: FastifyRequest<{ Body: OneInchTradeInput }>, response: FastifyReply) {
    const { walletAddress, srcChainId, dstChainId, srcToken, dstToken, amount } = request.body;

    // if (!validateChainId(srcChainId)) {
    //     throw new Error(`Invalid srcChainId: ${srcChainId}`);
    // }

    // if (!validateChainId(dstChainId)) {
    //     throw new Error(`Invalid dstChainId: ${dstChainId}`);
    // }

    await createTradeOrder(walletAddress, srcChainId as SupportedChain, dstChainId as SupportedChain, srcToken, dstToken, amount);
    response.status(200).send({ message: "Trade order created" });
}

function validateChainId(chainId: NetworkEnum): chainId is SupportedChain {
    if (chainId in SupportedChains || chainId.toString() in SupportedChains) {
        return true;
    }
    return false;
}