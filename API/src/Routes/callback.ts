import { FastifyInstance } from 'fastify';
import { Socket } from '../..';
import config from '../../config';

const path = "/callback";

export default (app: FastifyInstance) => {
    app.get(path, async (req, res) => {
        var query = req.query as {
            code: string;
            state: string & {
                guild: string;
                bot: string;
            },
            ip: string
        }

        if (!query.code) return res.status(400).redirect(config.redirect_not_found);
        if (!query.state) return res.status(400).redirect(config.redirect_not_found);

        try {
            query.state = JSON.parse(query.state);
        } catch (error) {
            return res.status(400).redirect(config.redirect_not_found);
        }

        if (!query.state.guild) return res.status(400).redirect(config.redirect_not_found);
        if (!query.state.bot) return res.status(400).redirect(config.redirect_not_found);

        query.ip = req.headers['cf-connecting-ip'] as string;

        const Client = Socket.getClient(query.state.bot);
        if (!Client) return res.status(500).redirect(config.redirect_not_found);

        await new Promise((resolve, reject) => {
            Client.emit('callback', query, async (status: number, data: string) => {
                await res.status(status).type('text/html; charset=utf-8').send(data);
                resolve(true);
            });
        })
    })
}