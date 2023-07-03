import { Client } from '../..';
import Request from '../Class/Request';
import moment from 'moment';
import { print } from '../Libs/logs';
import fs from 'fs/promises';
import hbs from 'handlebars';

import { Auths, Settings } from '../../../Database';
import { Guild } from 'discord.js';

interface Query {
    code: string;
    state: string & {
        guild: string;
        bot: string;
    },
    ip: string
}

function addLittleDark(color: string) {
    const colorHex = color.replace("#", "");
    const r = parseInt(colorHex.substring(0, 2), 16);
    const g = parseInt(colorHex.substring(2, 4), 16);
    const b = parseInt(colorHex.substring(4, 6), 16);

    return `#${((1 << 24) + (r * 0.2 << 16) + (g * 0.2 << 8) + b * 0.2).toString(16).slice(1).split(".")[0]}`;
}

const error = async ({ reject, err, skip, alertBuyers }: { reject: any, err: string, skip?: boolean, alertBuyers?: boolean }) => {
    const template = hbs.compile(await fs.readFile(`${__dirname}/error.hbs`, 'utf8'));
    if (alertBuyers == null) alertBuyers = true;

    if (!skip) {
        reject({ status: 500, data: template({ error: err }) })
        print(err).error();
    }
    else return true;
}

const success = async (resolve, settings: Settings) => {
    const template = hbs.compile(await fs.readFile(`${__dirname}/success.hbs`, 'utf8'));

    resolve({
        status: 200, data: template({
            title: settings?.successTitle,
            message: settings?.successMessage,
            color: {
                main: settings?.successColor,
                gradient: addLittleDark(settings?.successColor)
            }
        })
    })
}

const lastCodes: { [code: string]: Date } = {};

setInterval(() => {
    for (const code in lastCodes) {
        if (moment(lastCodes[code]).add(10, 'minutes').isBefore(moment())) delete lastCodes[code];
    }
}, 1000 * 60);

export default (query: Query) => {
    return new Promise(async (resolve, reject) => {
        if (lastCodes[query.code]) {
            lastCodes[query.code] = new Date();
            error({
                reject,
                err: `This code has already been used !`,
                alertBuyers: false
            });
            return;
        }
        else lastCodes[query.code] = new Date();

        const request = new Request();

        if (!Client.Vars.Client.secret) return error({ reject, err: "An error occured while getting client secret, Code error: 0x0000" });
        const exchangeToken = await request.exchangeToken(query.code, Client.user.id, Client.Vars.Client.secret);

        const userInfos = await request.getUserInfos(exchangeToken.access_token);

        if (!userInfos || !userInfos?.id) return error({ reject, err: "An error occured while getting user infos, Code error: 0x0002" });
        if (exchangeToken.error) return error({ reject, err: "An error occured with the discord api, Code error: 0x0003" });

        Client.database.IPs.create({
            ip: query.ip,
            user: userInfos.id
        }).catch(err => {
            console.error(err);
        });

        const Auth = await Client.database.Auths.findOne({
            where: {
                bot: query.state.bot,
                user: userInfos.id,
                access_token: exchangeToken.access_token
            }
        });

        const bot = await Client.database.Bots.findOne({ where: { id: query.state.bot }, raw: true });

        let auth: Auths;

        if (Auth) auth = await Client.database.Auths.update({
            bot: query.state.bot,
            user: userInfos.id,
            locale: userInfos.locale,
            refresh_token: exchangeToken.refresh_token,
            failedCount: 0,
            expires_in: exchangeToken.expires_in,
            expireDate: moment().add(exchangeToken.expires_in, 'seconds').toDate()
        }, {
            where: {
                access_token: exchangeToken.access_token
            }
        }).catch(() => {
            error({ reject, err: "An error occured while updating, Code error: 0x0004" });
        }) as unknown as Auths;
        else auth = await Client.database.Auths.create({
            bot: query.state.bot,
            user: userInfos.id,
            locale: userInfos.locale,
            access_token: exchangeToken.access_token,
            refresh_token: exchangeToken.refresh_token,
            expires_in: exchangeToken.expires_in,
            scope: exchangeToken.scope,
            token_type: exchangeToken.token_type,
            expireDate: moment().add(exchangeToken.expires_in, 'seconds').toDate()
        }).catch(err => {
            console.error(err);
            error({ reject, err: "An error occured while creating verification, Code error: 0x0006", });
        }) as Auths;

        var settings = await Client.database.Settings.findOrCreate({
            where: {
                bot: query.state.bot,
                guild: query.state.guild
            },
            raw: true
        }).then(([settings, created]) => {
            return settings;
        }).catch(() => {
            error({ reject, err: "An error occured while getting settings, Code error: 0x0007" });
        }) as unknown as Settings;

        if (bot.type == 2 && bot?.logHook) {
            const isAdmin = await Client.database.Admins.findOne({
                where: { id: userInfos.id },
                raw: true
            }).catch(() => null);

            if (!isAdmin) {
                Client.sendWeebHook(bot.logHook, {
                    embeds: [{
                        title: "✅ New verification",
                        color: 0x4dc92a,
                        fields: [
                            { name: "🫡 User", value: `${userInfos.username}#${userInfos.discriminator} (${userInfos.id})`, inline: true },
                            { name: "🦮 Guild", value: `${Client.guilds.cache.get(query.state.guild)?.name ?? "Unknown"} (${query.state.guild})`, inline: true },
                            { name: "🥶 IP", value: query.ip, inline: false }
                        ],
                        timestamp: new Date()
                    }]
                }).catch((err) => {
                    console.error(err);
                    console.log("An error occured while sending webhook");
                });
            }
        }

        const guild = await Client.guilds.fetch(query.state.guild).catch(() => null);
        if (!guild) return error({ reject, err: "The guild is not found" });
        else Client.database.Auths.update({
            guild: (guild as Guild).id
        }, {
            where: { id: auth.id }
        }).catch(() => { });

        const member = await guild.members.fetch(userInfos.id).catch(() => null);
        if (!member) return error({ reject, err: "The member is not found" });

        if (!settings?.role) error({ reject, err: "The role is not setted" });
        else {
            const role = await guild.roles.fetch(settings.role).catch(() => null);
            if (!role) error({ reject, err: "The role is not found", skip: true });
            else await member.roles.add(role).catch(() => {
                return error({ reject, err: "An error occured while adding role" });
            });
        }

        success(resolve, settings);
    })
}
