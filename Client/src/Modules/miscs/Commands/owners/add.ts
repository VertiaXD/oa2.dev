import cmd from ".";
import { Client } from "../../../../..";

cmd.setHandler({ sub: "add" }, async (interaction) => {
    await interaction.deferReply({ ephemeral: true });

    if (!await Client.database.Bots.findOne({ where: { id: Client.user.id } }).then(bot => bot.buyer.includes(interaction.user.id))) {
        interaction.editReply({ content: "⚠ You are not the buyer of this bot !" });
        return false;
    }

    const user = interaction.options.getUser("user");

    let buyers: string[] = [],
        owners: string[] = [];

    await Client.database.Bots.findOne({ where: { id: Client.user.id } }).then(bot => {
        buyers.push(...bot.buyer);
        owners.push(...bot.owners);
    });

    const botType = await Client.database.Bots.findOne({ where: { id: Client.user.id } }).then(bot => bot.type) as 0 | 1 | 2;

    if (buyers.includes(user.id) || owners.includes(user.id)) {
        interaction.editReply({ content: "❌ This user is already in the list of owners" });
        return false;
    }

    if (botType === 0 && buyers.length + owners.length >= 1) {
        interaction.editReply({ content: "❌ You can't add more than 1 owner" });
        return false;
    } else if (botType === 1 && buyers.length + owners.length >= 3) {
        interaction.editReply({ content: "❌ You can't add more than 3 owners" });
        return false;
    } else if (botType === 2 && buyers.length + owners.length >= 6) {
        interaction.editReply({ content: "❌ You can't add more than 6 owners" });
        return false;
    }

    owners.push(user.id);

    await Client.database.Bots.update({
        owners: JSON.stringify(owners)
    }, {
        where: {
            id: Client.user.id
        }
    }).then(() =>
        interaction.editReply({
            content: "✅ User added to the owners list"
        })
    ).catch(() =>
        interaction.editReply({
            content: "❌ An error occurred while adding the user to the owners list"
        })
    );

    return true;
});