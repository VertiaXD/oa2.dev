/// <reference types="node" />
export default class ExtendedFastify {
    app: import("fastify").FastifyInstance<import("http").Server, import("http").IncomingMessage, import("http").ServerResponse, import("fastify").FastifyBaseLogger, import("fastify").FastifyTypeProviderDefault> & PromiseLike<import("fastify").FastifyInstance<import("http").Server, import("http").IncomingMessage, import("http").ServerResponse, import("fastify").FastifyBaseLogger, import("fastify").FastifyTypeProviderDefault>>;
    http: import("http").Server;
    port: number;
    constructor(port?: number);
    init(): Promise<this>;
    private loadRoutes;
}
