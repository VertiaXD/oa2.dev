import cmd from ".";
import { Process } from "./join";

cmd.setHandler({ "sub": "stop" }, async (interaction) => {
    await interaction.deferReply();

    const guildid = interaction.options.get('guildid')?.value as string;
    const Promise = Process.get(guildid);

    if (!Promise || Promise.stop) {
        interaction.editReply({ content: "Aucun processus n'est en cours sur ce serveur." });
        return true;
    }
    Promise.stop = true;

    interaction.editReply({ content: "Le processus a été arrêté." });
    return true;
});