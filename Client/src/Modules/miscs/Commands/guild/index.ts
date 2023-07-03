import { ChannelType, GuildInvitableChannelResolvable } from "discord.js";
import Commands from "../../../../Class/Commands";
import options from './options';

const cmd = new Commands(options, []);

cmd.setHandler({ sub: "invite" }, async (interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const args = {
        guild: interaction.options.getString('server')
    }

    const guild = await interaction.client.guilds.fetch(args.guild);
    if (!guild) {
        interaction.editReply('Guild not found.');
        return false;
    }

    const invite = await guild.invites.create((await guild.channels.fetch()).filter(c => c.type === ChannelType.GuildText).first() as GuildInvitableChannelResolvable).catch(() => "Uknown error");
    if (typeof invite === 'string') {
        interaction.editReply(invite);
        return false;
    } else interaction.editReply(invite.url);

    return true;
});

export default cmd;