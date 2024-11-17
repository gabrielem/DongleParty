import Fastify, { } from 'fastify';

import { tradeSchemas } from './modules/trade/trade.schema';
import { tradeRoutes } from './modules/trade/trade.route';

declare module 'fastify' {
    export interface FastifyInstance {
        authenticate: any;
    }
}

export default async function buildApp() {
    const fastify = Fastify({
        logger: {
            transport: {
                target: "pino-pretty",
                options: {
                    translateTime: "HH:MM:ss Z",
                    ignore: "pid,hostname",
                },
            },
        }
    });
    const allSchemas = [...tradeSchemas];
    for (const schema of allSchemas) {
        fastify.addSchema(schema);
    }


    fastify.get('/healthcheck', function () {
        return { status: 200 };
    });

    fastify.register(tradeRoutes, { prefix: 'api/trade' });

    return fastify;
}