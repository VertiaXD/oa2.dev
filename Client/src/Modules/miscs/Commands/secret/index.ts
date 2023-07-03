import { Client } from "../../../../..";
import Commands from "../../../../Class/Commands";
import options from './options';

const cmd = new Commands(options, []);

cmd.setHandler({}, async (interaction) => {
    await interaction.deferReply({ ephemeral: true });

    var args = {
        secret: interaction.options.getString('secret')
    }

    await Client.database.Bots.update({ secret: args.secret }, {
        where: { id: Client.user.id }
    });

    Client.Vars.Client.secret = args.secret;

    interaction.editReply({ content: "✅ The secret has been updated." });
    return true;
});

export default cmd;