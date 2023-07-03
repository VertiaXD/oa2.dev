import fetch, { Response } from 'node-fetch';
import getProxy from '../../proxy'

import 'dotenv/config';
import moment from 'moment';
import * as Database from '../../Database';

export interface ExchangeToken {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: string;
    error?: string;
    error_description?: string;
    code: number;
    message: string;
}

export interface Refresh {
    success?: boolean;
    updated?: boolean;
    deleted?: boolean;
    httpError?: string;
}

export interface getUserInfos {
    success?: boolean;
    user?: User;
    httpError?: string;
}

export interface User {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    flags: number;
    locale: string;
    message: string;
    code: number;
}

export default class Request {
    public getUserInfos(access_token: string): Promise<getUserInfos> {
        return new Promise(async (resolve, reject) => {
            const proxy = getProxy();

            fetch(`https://discord.com/api/users/@me`, {
                method: 'GET',
                agent: proxy.agent,
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(async (res: { json: () => PromiseLike<User> }) => {
                const user = await res.json();

                resolve({
                    success: user.username ? true : false,
                    user: user
                });
            }).catch(err => {
                resolve({
                    httpError: err.message as string
                });
            });
        })
    }

    public refreshToken(auth: Database.Auths, clientId: string, clientSecret: string): Promise<Refresh> {
        return new Promise(async (resolve, reject) => {
            const proxy = getProxy();

            const refresh = await fetch(`https://discord.com/api/oauth2/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                agent: proxy.agent,
                body: new URLSearchParams({
                    client_id: clientId,
                    client_secret: clientSecret,
                    grant_type: 'refresh_token',
                    refresh_token: auth.refresh_token
                })
            }).catch(err => {
                return {
                    httpError: err.message as string
                }
            });

            if (!(refresh instanceof Response) && refresh.httpError) return resolve({
                success: false,
                updated: false,
                deleted: false,
                httpError: refresh.httpError
            });
            if (!(refresh instanceof Response)) return;

            const response = await refresh.json() as ExchangeToken;

            // If error, increment refreshFailed
            // If refreshFailed >= 4, delete auth
            // Else, save auth
            if (response?.error || response?.message) {
                auth.refreshFailed++;

                if (auth.refreshFailed >= 4) {
                    console.log('🍅 Refresh failed 3 times, deleting %s', auth.id);
                    await auth.destroy();
                    return resolve({
                        success: false,
                        updated: false,
                        deleted: true
                    });
                } else {
                    console.log('🍅 Refresh failed for %s', auth.id);
                    await auth.save();
                    return resolve({
                        success: false,
                        updated: false,
                        deleted: false
                    });
                };
            }

            const updated = await Database.Auths.update({
                access_token: response.access_token,
                refresh_token: response.refresh_token,
                expire_in: response.expires_in,
                userInformationsFailed: 0,
                refreshFailed: 0,
                expireDate: moment().add(response.expires_in, 'seconds').toDate(),
                token_type: response.token_type,
                scope: response.scope
            }, { where: { id: auth.id } }).catch((err) => {
                console.log(err);
                return false;
            });
            if (updated == false) return resolve({
                success: false,
                updated: false,
                deleted: false
            });

            console.log('💬 Refresh success for %s', auth.id);
            resolve({
                success: true,
                updated: true,
                deleted: false
            });
        })
    }
}