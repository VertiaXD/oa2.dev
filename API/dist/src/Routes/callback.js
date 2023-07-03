"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
const config_1 = __importDefault(require("../../config"));
const path = "/callback";
exports.default = (app) => {
    app.get(path, async (req, res) => {
        var query = req.query;
        if (!query.code)
            return res.status(400).redirect(config_1.default.redirect_not_found);
        if (!query.state)
            return res.status(400).redirect(config_1.default.redirect_not_found);
        try {
            query.state = JSON.parse(query.state);
        }
        catch (error) {
            return res.status(400).redirect(config_1.default.redirect_not_found);
        }
        if (!query.state.guild)
            return res.status(400).redirect(config_1.default.redirect_not_found);
        if (!query.state.bot)
            return res.status(400).redirect(config_1.default.redirect_not_found);
        query.ip = req.headers['cf-connecting-ip'];
        const Client = __1.Socket.getClient(query.state.bot);
        if (!Client)
            return res.status(500).redirect(config_1.default.redirect_not_found);
        await new Promise((resolve, reject) => {
            Client.emit('callback', query, async (status, data) => {
                await res.status(status).type('text/html; charset=utf-8').send(data);
                resolve(true);
            });
        });
    });
};
//# sourceMappingURL=callback.js.map