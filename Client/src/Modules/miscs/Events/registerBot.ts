import Event from '../../../Interfaces/Event';
import ExtendedClient from "../../../Class/Client";

export const registerBot: Event = {
    name: 'ready',
    run: async (client: ExtendedClient) => {
        const bot = await client.database.Bots.findOne({
            where: {
                id: client.user.id
            }
        });

        if (!bot) {
            await client.database.Bots.create({
                id: client.user.id,
                secret: client.Vars.Client.secret,
                token: client.Vars.Client.token
            }).catch(err => {
                console.log(err);
            });

            (await client.guilds.fetch()).forEach(async guild => {
                await client.pushCommandGuild(guild.id);
            });

            await client.deleteGlobalCommands();
        }
        else await client.database.Bots.update({
            secret: client.Vars.Client.secret,
            token: client.Vars.Client.token
        }, {
            where: {
                id: client.user.id
            }
        }).catch(err => {
            console.log(err);
        });
    }
}