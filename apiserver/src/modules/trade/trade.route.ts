import { FastifyInstance } from 'fastify';
import { handleOneInchTrade } from './trade.controller';
import { $ref } from './trade.schema';


export async function tradeRoutes(server: FastifyInstance) {
    server.post(
        '/1inch',
        {
            //   preHandler: [server.authenticate],
            schema: {
                body: $ref('oneInchTradeInput'),
            },
        },
        handleOneInchTrade
    );
}