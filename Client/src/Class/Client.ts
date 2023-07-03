import { Client, ClientOptions, Routes } from 'discord.js';
import * as database from '../../../Database';
import * as log from '../Libs/logs';
import path from 'path';
import fetch from 'node-fetch';
import 'dotenv/config';
import fs from 'fs';
import { Module } from '../Interfaces';
import Event from '../Interfaces/Event';
import Commands from './Commands';
import { io } from 'socket.io-client';
import Callback from '../Functions/Callback';
import getProxy from '../../../proxy';
import config from '../../config';

export default class ExtendedClient extends Client {
    static modulesPath = path.join(__dirname, '../Modules');
    public Commands: Map<String, Commands> = new Map();
    public database = database;
    public Vars = {
        Discord: {
            API_BASE: config.API_BASE,
            OAUTH2_URI: `https://discord.com/api/oauth2/authorize?client_id=${process.argv[2]}&redirect_uri=https%3A%2F%2Foauth.m1000.fr%2Fcallback&response_type=code&scope=identify%20guilds.join`,
            REDIRECTION_URI: config.REDIRECTION_URI
        },
        Client: {
            token: process.argv[2],
            secret: null
        },
        debugCMD: false,
        socket: null
    };

    public libs = {
        log
    };

    constructor(options: ClientOptions) {
        super(options);
        this.init();
    }

    private async init() {
        this.database.sequelizeInstance.authenticate().then(() => {
            this.libs.log.print('Connected.', 'Database').success();
        }).catch(error => {
            this.libs.log.print('Error: %s', 'Database', true).error(error);
        });

        this.database.sequelizeInstance.sync().then(() => {
            this.libs.log.print('Synchronized.', 'Database').success();
        }).catch(error => {
            this.libs.log.print('Error: %s', 'Database', true).error(error);
        });

        await this.loadModules();
        await this.login(this.Vars.Client.token).catch(error => {
            this.libs.log.print('Error: %s', 'Discord', true).error(error);
            process.exit(404);
        });
        this.startSocket();

        this.Vars.Client.secret = await this.database.Bots.findOne({ where: { id: this.user.id } }).then(db => db?.secret).catch(() => null);
    }

    private startSocket() {
        const socket = io(`http://localhost:8081?bot=${this.user.id}`, { reconnection: true });

        socket.on('connect', () => {
            this.libs.log.print('Connected.', 'Socket').success();
        });

        socket.on('callback', (data: any, Res: any) => {
            Callback(data).then((res: any) => {
                Res(res.status, res.data);
            }).catch(err => {
                Res(err.status, err.data);
            })
        });
    }

    private async loadModules() {
        for (const m of fs.readdirSync(ExtendedClient.modulesPath)) {
            const t1 = Date.now();
            const module = require(path.join(ExtendedClient.modulesPath, m)) as Module;
            var eventCount = 0,
                cmdCount = 0;

            // Events
            for (const Event of Object.keys(module.Events)) {
                const event = module.Events[Event] as Event;
                if (event.name) {
                    this.on(event.name, (...args) => event.run(...args));
                    eventCount++;
                    continue;
                } else {
                    // Group of Events
                    for (const Event of Object.keys(event)) {
                        const e = event[Event] as Event;
                        if (e.name) this.on(e.name, (...args) => e.run(...args));
                        eventCount++;
                        continue;
                    }
                }
            }

            // Commands
            for (const Command of Object.keys(module.Commands)) {
                const command = module.Commands[Command] as Commands;
                this.Commands.set(command.options.name, command);
                cmdCount++;
            }

            this.libs.log.print(`Load %s, %s commands, %s events, in %s ms.`, 'Modules').log(m, cmdCount, eventCount, Date.now() - t1);
        }
    }

    public async fetchCommands() {
        for (const m of fs.readdirSync(ExtendedClient.modulesPath)) {
            const module = require(path.join(ExtendedClient.modulesPath, m)) as Module;

            for (const Command of Object.keys(module.Commands)) {
                const command = module.Commands[Command] as Commands;
                this.Commands.set(command.options.name, command);
            }
        }
    }

    public async pushCommandGuild(guild: string) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!guild) return reject('No guild provided.');

                const data = Array.from(this.Commands.values()).map(c => c.options);
                await this.rest.put(
                    Routes.applicationGuildCommands(this.user?.id.toString() as string, guild),
                    { body: data },
                );

                log.print('Commands registered on %s', 'Discord').log(guild);
                resolve(true);
            } catch (error) {
                return reject(error);
            }
        })
    }

    public deleteGlobalCommands() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.rest.put(
                    Routes.applicationCommands(this.user?.id.toString() as string),
                    { body: [] },
                );

                log.print('Commands removed', 'Discord').warn();
                resolve(true);
            } catch (error) {
                return reject(error);
            }
        })
    }

    public sendWeebHook(url: string, data: any): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch(url, {
                    method: 'POST',
                    agent: getProxy().agent,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (!res.ok) return reject(res.statusText);

                resolve(true);
            } catch (error) {
                return reject(error);
            }
        })
    }
}
