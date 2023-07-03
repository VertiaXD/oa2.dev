import { Client } from "../../../../..";
import Commands from "../../../../Class/Commands";
import options from './options';

const cmd = new Commands(options, []);

cmd.setHandler({}, async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    
    await Client.pushCommandGuild(interaction.guild.id).catch(err => {
        console.log(err);
        interaction.editReply({
            content: 'Something went wrong'
        });
        return false;
    });

    interaction.editReply({
        content: 'Commands reloaded'
    }).catch(() => {});

    return true;
});

export default cmd;