import { Guild } from 'discord.js';
import { Client } from '../../../..';
import { Event } from '../../../Interfaces';

export const onGuildAdded: Event = {
    name: 'guildCreate',
    run: async (guild: Guild) => {
        Client.database.Settings.create({
            where: {
                bot: Client.user.id,
                guild: guild.id
            }
        }).catch(() => { });
        await Client.pushCommandGuild(guild.id).catch(err => {
            console.error(`try to push command on guild ${guild.id} but failed: ${err?.message ?? 'unknown error'}`);
        })
    }
}

export const OnReady: Event = {
    name: 'ready',
    run: async () => {
        const guilds = await Client.guilds.fetch();

        guilds.forEach(async guild => {
            const settings = await Client.database.Settings.findOne({
                where: {
                    bot: Client.user.id,
                    guild: guild.id
                },
                raw: true
            });

            if (!settings) {
                await Client.database.Settings.create({
                    where: {
                        bot: Client.user.id,
                        guild: guild.id
                    }
                }).catch(() => { });
            }

            if (Client.Vars.debugCMD) await Client.pushCommandGuild(guild.id);
        });
    }
}