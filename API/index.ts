import ExtendedFastify from "./src/Class/Fastify";
import ExtendedSocket from "./src/Class/Socket";

export const Fastify = new ExtendedFastify(8080).init(),
    Socket = new ExtendedSocket(8081).init();