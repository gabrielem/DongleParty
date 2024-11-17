import { z } from "zod";
import { buildJsonSchemas } from 'fastify-zod';
import { NetworkEnum } from '@1inch/cross-chain-sdk';


const oneInchTradeInput = z.object({
  walletAddress: z.string(),
  srcChainId: z.nativeEnum(NetworkEnum),
  dstChainId: z.nativeEnum(NetworkEnum),
  srcToken: z.string(),
  dstToken: z.string(),
  amount: z.string(),
});

export type OneInchTradeInput = z.infer<typeof oneInchTradeInput>;

export const { schemas: tradeSchemas, $ref } = buildJsonSchemas(
  {
    oneInchTradeInput,
  },
  { $id: 'tradeSchema' }
);