import Commands from "../../../../Class/Commands";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, TextChannel } from "discord.js";
import options from './options';
import { Client } from "../../../../..";

const cmd = new Commands(options, []);

cmd.setHandler({}, async (interaction) => {
    await interaction.deferReply({ ephemeral: true });

    var args = {
        buttonName: interaction.options.get("buttonname").value as string,
        message: interaction.options.get("message")?.value as string,
        channel: interaction.options.get("channel")?.channel as TextChannel
    }

    const message = await interaction.channel.messages.fetch(args.message).catch(() => null);
    if (!message) {
        interaction.editReply({ content: "Message not found" });
        return false;
    }
    if (!args.channel) {
        args.channel = interaction.channel as TextChannel;
    } else if (args.channel.type !== ChannelType.GuildText) {
        interaction.editReply({ content: "Channel must be a text channel" });
        return false;
    }

    const redirect_uri = encodeURIComponent(Client.Vars.Discord.REDIRECTION_URI);
    const state = encodeURIComponent(JSON.stringify({
        guild: interaction.guildId,
        bot: Client.user.id
    }));
    const callbackURL = `${Client.Vars.Discord.API_BASE}/oauth2/authorize?client_id=${Client.user.id}&redirect_uri=${redirect_uri}${encodeURI("&response_type=code&scope=identify guilds.join")}&state=${state}`;

    const Settings = await Client.database.Settings.findCreateFind({
        where: {
            bot: Client.user.id,
            guild: interaction.guildId
        },
        attributes: ["role"],
        raw: true
    });

    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(new ButtonBuilder()
            .setLabel(args.buttonName)
            .setStyle(ButtonStyle.Link)
            .setURL(callbackURL));

    args.channel.send({
        components: [row],
        embeds: message.embeds,
        content: message.content
    });

    interaction.editReply({ content: `Message sent${!Settings[0]?.role ? "\n**Don't forget to set a role with command `/role`**" : ""}` });
});

export default cmd;