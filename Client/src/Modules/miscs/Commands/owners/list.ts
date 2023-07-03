import cmd from ".";
import { Client } from "../../../../..";

cmd.setHandler({ sub: "list" }, async (interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const list = await Client.database.Bots.findOne({ where: { id: Client.user.id } }).then(bot => bot.owners.concat(bot.buyer));
    
    interaction.editReply({
        content: list.length > 0 ? list.map(l => `<@${l}>`).join(", ") : "Any owner is set."
    });

    return true;
});