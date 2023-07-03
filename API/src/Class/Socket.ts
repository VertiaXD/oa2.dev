import { Server, Socket } from 'socket.io';
import { print } from '../Libs/logs';

export default class ExtendedSocket {
    public port: number;
    public io: Server;
    public clients: Map<string, Socket> = new Map();

    constructor(port: number) {
        this.port = port;
        this.io = new Server(this.port, { cors: { origin: '*' } });
        print('Listening on port %s', 'Socket').success(this.port);
    }

    public init() {
        this.io.on('connection', (socket) => {
            const clientId = socket.handshake.query.bot as string;

            this.clients.set(clientId, socket);
            print(`Client %s connected`).log(clientId);

            socket.on('disconnect', () => {
                this.clients.delete(clientId);
                print(`Client %s disconnected`).log(clientId);
            });
        });
        return this;
    }

    public getClient(id: string) {
        return this.clients.get(id);
    }
}