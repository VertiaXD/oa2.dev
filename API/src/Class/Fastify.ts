import Fastify from 'fastify';

import { print } from '../Libs/logs';
import * as routes from '../Routes';

export default class ExtendedFastify {
    public app = Fastify();
    public http = this.app.server;
    public port: number;

    constructor(port?: number) {
        this.port = port ? port : 3000
    }

    public async init() {
        await this.app.register(import('@fastify/express'));

        // disable FavIcon request
        this.app.use((req, res, next) => {
            if (req.originalUrl.includes('favicon.ico')) res.status(204).json({ nope: true });
            else next();
        });

        this.loadRoutes();

        this.app.listen({ port: this.port, host: "0.0.0.0" }, () => {
            print('Listening on port %s', 'Fastify').success(this.port)
        });
        return this;
    }

    private loadRoutes() {
        for (const route of Object.keys(routes)) {
            if (!routes[route]) continue;
            routes[route](this.app);
            print('Load route %s', 'Fastify').success(route);
        }

        this.app.all('*', (req, res) => {
            // redirect to domain oa2.dev
            res.redirect(301, `https://idlewoodrpg.com`);
        })
    }
}