import { Client } from "../../../../..";
import Commands from "../../../../Class/Commands";
import options from './options';

const cmd = new Commands(options, []);

cmd.setHandler({}, async (interaction) => {
    await interaction.deferReply({ ephemeral: true });

    var args = {
        url: interaction.options.getString('url')
    }

    const regex = new RegExp(/https:\/\/discord.com\/api\/webhooks\/\d+\/[a-zA-Z0-9-_]{68}/);
    if (!regex.test(args.url)) {
        interaction.editReply('Invalid url.');
        return false;
    }

    await Client.database.Bots.update({ logHook: args.url }, {
        where: { id: Client.user.id }
    });

    interaction.editReply({ content: "✅ The secret has been updated." });
    return true;
});

export default cmd;