"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const logs_1 = require("../Libs/logs");
class ExtendedSocket {
    port;
    io;
    clients = new Map();
    constructor(port) {
        this.port = port;
        this.io = new socket_io_1.Server(this.port, { cors: { origin: '*' } });
        (0, logs_1.print)('Listening on port %s', 'Socket').success(this.port);
    }
    init() {
        this.io.on('connection', (socket) => {
            const clientId = socket.handshake.query.bot;
            this.clients.set(clientId, socket);
            (0, logs_1.print)(`Client %s connected`).log(clientId);
            socket.on('disconnect', () => {
                this.clients.delete(clientId);
                (0, logs_1.print)(`Client %s disconnected`).log(clientId);
            });
        });
        return this;
    }
    getClient(id) {
        return this.clients.get(id);
    }
}
exports.default = ExtendedSocket;
//# sourceMappingURL=Socket.js.map