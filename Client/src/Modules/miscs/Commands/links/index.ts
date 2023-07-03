import { Client } from "../../../../..";
import Commands from "../../../../Class/Commands";
import options from './options';

const cmd = new Commands(options, []);

cmd.setHandler({}, async (interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const redirect_uri = encodeURIComponent(Client.Vars.Discord.REDIRECTION_URI),
        state = encodeURIComponent(JSON.stringify({
            guild: interaction.guildId,
            bot: interaction.client.user.id
        })),
        callbackURL = `${Client.Vars.Discord.API_BASE}/oauth2/authorize?client_id=${Client.user.id}&redirect_uri=${redirect_uri}${encodeURI("&response_type=code&scope=identify guilds.join")}&state=${state}`;

    var str = "";
    str += `oAuth: **${callbackURL}**\n\n`;
    str += `Bot: **https://discord.com/api/oauth2/authorize?client_id=${Client.user.id}&permissions=8&scope=bot%20applications.commands**\n\n`

    interaction.editReply({
        content: str
    });

    return true;
});

export default cmd;