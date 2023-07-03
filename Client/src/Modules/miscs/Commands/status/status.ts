import { PresenceStatusData } from "discord.js";
import cmd from ".";

cmd.setHandler({ "sub": "state" }, async (interaction) => {
    var vars = {
        status: interaction.options.getString('state') as PresenceStatusData
    }

    interaction.client.user.setPresence({
        status: vars.status
    });

    interaction.reply({ content: `Status set to \`${vars.status}\``, ephemeral: true });

    return true;
});