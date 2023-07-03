import { Client } from "../../../../..";
import Commands from "../../../../Class/Commands";
import options from './options';

const cmd = new Commands(options, []);

cmd.setHandler({}, async (interaction) => {
    await interaction.deferReply();

    const args = {
        title: interaction.options.get('title')?.value as string,
        message: interaction.options.get('message')?.value as string,
        color: interaction.options.get('color')?.value as string,
    }

    if (!args.title && !args.message && !args.color) {
        interaction.editReply({ content: "❌ Tu dois mettre un titre, un message ou une couleur." });
        return false;
    }

    Client.database.Settings.findOrCreate({
        where: {
            bot: interaction.client.user.id,
            guild: interaction.guildId
        },
        defaults: {
            bot: interaction.client.user.id,
            guild: interaction.guildId,
            successTitle: args?.title,
            successMessage: args?.message,
            successColor: args?.color
        }
    }).then(([settings, created]) => {
        interaction.editReply({
            content: "✅ Le message de succès a bien été modifiés."
        });
    }).catch((err) => {
        console.error(err);
        interaction.editReply({
            content: "❌ Une erreur est survenue lors de la modification du message de succès."
        });
    });

    return true;
});

export default cmd;
