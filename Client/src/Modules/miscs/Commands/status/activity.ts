import { ActivityType } from "discord.js";
import cmd from ".";

cmd.setHandler({ "sub": "activity" }, async (interaction) => {

    var vars = {
        activity: interaction.options.getString('activity'),
        name: interaction.options.getString('name'),
        url: interaction.options.getString('url')
    }

    interaction.client.user.setPresence({
        activities: [{
            name: vars.name,
            type: ActivityType[vars.activity.toUpperCase()],
            url: vars.url ? vars.url : undefined
        }]
    });

    interaction.reply({ content: `Activity set to \`${vars.activity}\``, ephemeral: true });

    return true;
});
