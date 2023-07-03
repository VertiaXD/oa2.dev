"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const logs_1 = require("../Libs/logs");
const routes = __importStar(require("../Routes"));
class ExtendedFastify {
    app = (0, fastify_1.default)();
    http = this.app.server;
    port;
    constructor(port) {
        this.port = port ? port : 3000;
    }
    async init() {
        await this.app.register(Promise.resolve().then(() => __importStar(require('@fastify/express'))));
        // disable FavIcon request
        this.app.use((req, res, next) => {
            if (req.originalUrl.includes('favicon.ico'))
                res.status(204).json({ nope: true });
            else
                next();
        });
        this.loadRoutes();
        this.app.listen({ port: this.port, host: "0.0.0.0" }, () => {
            (0, logs_1.print)('Listening on port %s', 'Fastify').success(this.port);
        });
        return this;
    }
    loadRoutes() {
        for (const route of Object.keys(routes)) {
            if (!routes[route])
                continue;
            routes[route](this.app);
            (0, logs_1.print)('Load route %s', 'Fastify').success(route);
        }
        this.app.all('*', (req, res) => {
            // redirect to domain oa2.dev
            res.redirect(301, `https://idlewoodrpg.com`);
        });
    }
}
exports.default = ExtendedFastify;
//# sourceMappingURL=Fastify.js.map