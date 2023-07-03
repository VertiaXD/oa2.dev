import fetch from 'node-fetch';

import 'dotenv/config';
import { print } from '../Libs/logs';
import User from '../Interfaces/DiscordAPI/user';
import { Client } from '../..';
import moment from 'moment';
import getProxy from "../../../proxy";

export interface ExchangeToken {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: string;
    error?: string;
    error_description?: string;
    message: string;
    code: number;
}

export interface JoinSuccess {
    flags: number;
    is_pending: boolean;
    joined_at: string;
    pending: boolean;
    roles: [];
    user: {
        id: string;
        username: string;
        avatar: string;
        discriminator: string;
        public_flags: number;
    }
    mute: boolean;
    deaf: boolean;
}

export interface JoinError {
    message: string;
    code: number;
}

export interface RateLimit {
    global: boolean;
    message: string;
    retry_after: number;
}

export default class Request {
    public exchangeToken(code: string, client_id: string, client_secret: string): Promise<ExchangeToken> {
        return new Promise(async (resolve, reject) => {
            fetch(`${Client.Vars.Discord.API_BASE}/oauth2/token`, {
                method: 'POST',
                agent: getProxy().agent,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    client_id: client_id,
                    client_secret: client_secret,
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: Client.Vars.Discord.REDIRECTION_URI,
                    scope: 'identify guilds.join'
                })
            }).then(async (res) => {
                print(`Exchanged token for code %s`, 'API').success(code);
                resolve(await res.json() as any);
                return;
            }).catch((err) => {
                print(`Failed to exchange token for code %s`, 'API').error(code);
                reject(err);
                return;
            });
        })
    }

    public JoinServer(access_token: string, guildID: string, userID: string, token: string): Promise<boolean | JoinSuccess | JoinError | RateLimit> {
        return new Promise(async (resolve, reject) => {
            fetch(`${Client.Vars.Discord.API_BASE}/guilds/${guildID}/members/${userID}`, {
                method: 'PUT',
                agent: getProxy().agent,
                headers: {
                    'Authorization': `Bot ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    access_token
                })
            }).then(async (res) => {
                let json = await res.json().catch(e => { return e; });
                resolve(json as any);
            }).catch((err) => {
                print(`Failed to join server %s with token %s\n%s`, 'API').error(guildID, access_token, err);
                resolve(false);
                return;
            });
        })
    }

    public getUserInfos(access_token: string): Promise<User> {
        return new Promise(async (resolve, reject) => {
            fetch(`${Client.Vars.Discord.API_BASE}/users/@me`, {
                method: 'GET',
                agent: getProxy().agent,
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(async (res) => resolve(await res.json() as any)).catch((err) => {
                print(`Failed to get user infos with token %s`, 'API').error(access_token);
                reject(err);
                return;
            });
        })
    }
}