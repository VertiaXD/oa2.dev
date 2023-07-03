import cmd from ".";
import { Client } from "../../../../..";

cmd.setHandler({ sub: "remove" }, async (interaction) => {
    await interaction.deferReply({ ephemeral: true });

    if (!await Client.database.Bots.findOne({ where: { id: Client.user.id } }).then(bot => bot.buyer.includes(interaction.user.id))) {
        interaction.editReply({ content: "⚠ You are not the buyer of this bot !" });
        return false;
    }

    const user = interaction.options.getUser("user");

    const list = await Client.database.Bots.findOne({ where: { id: Client.user.id } }).then(bot => bot.owners);
    if (!list.includes(user.id)) {
        interaction.editReply({ content: "❌ This user is not in the list of owners" });
        return false;
    }

    list.splice(list.indexOf(user.id), 1);

    await Client.database.Bots.update({
        owners: JSON.stringify(list)
    }, {
        where: {
            id: Client.user.id
        }
    }).then(() =>
        interaction.editReply({
            content: "✅ User removed to the owners list"
        })
    ).catch(() =>
        interaction.editReply({
            content: "❌ An error occurred while removing the user to the owners list"
        })
    );

    return true;
});