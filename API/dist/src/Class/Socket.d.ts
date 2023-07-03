import { Server, Socket } from 'socket.io';
export default class ExtendedSocket {
    port: number;
    io: Server;
    clients: Map<string, Socket>;
    constructor(port: number);
    init(): this;
    getClient(id: string): Socket<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>;
}
