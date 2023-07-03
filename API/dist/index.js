"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Socket = exports.Fastify = void 0;
const Fastify_1 = __importDefault(require("./src/Class/Fastify"));
const Socket_1 = __importDefault(require("./src/Class/Socket"));
exports.Fastify = new Fastify_1.default(8080).init(), exports.Socket = new Socket_1.default(8081).init();
//# sourceMappingURL=index.js.map