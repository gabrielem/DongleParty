import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

import { swaggerOptions } from './utils/swagger';
import { tradeSchemas } from './modules/trade/trade.schema';
import { tradeRoutes } from './modules/trade/trade.route';



declare module 'fastify' {
    export interface FastifyInstance {
        authenticate: any;
    }
}



export default async function buildApp() {
    const fastify = Fastify();
    const allSchemas = [...tradeSchemas];
    for (const schema of allSchemas) {
        fastify.addSchema(schema);
    }

    await fastify.register(fastifySwagger, swaggerOptions);
    await fastify.register(fastifySwaggerUi, swaggerOptions);


    fastify.get('/healthcheck', function () {
        return { status: 200 };
    });

    fastify.register(tradeRoutes, { prefix: 'api/trade' });

    return fastify;
}