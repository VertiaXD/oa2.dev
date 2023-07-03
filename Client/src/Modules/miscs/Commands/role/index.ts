import { Client } from "../../../../..";
import Commands from "../../../../Class/Commands";
import options from './options';

const cmd = new Commands(options, []);

cmd.setHandler({}, async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    var args = {
        role: interaction.options.get('role')?.role
    }

    if (!args.role?.id) {
        interaction.reply({
            content: 'Please provide a role',
            ephemeral: true
        });
        return false;
    }
    
    await Client.database.Settings.findOrCreate({
        where: {
            bot: Client.user.id,
            guild: interaction.guildId
        }
    }).then(([settings, created]) => {
        settings.role = args.role.id;
        settings.save();

        interaction.editReply({
            content: '✅ The role has been updated'
        });
    }).catch(() => {
        interaction.editReply({
            content: '❌ An error occured while updating'
        });
    });

    return true;
});

export default cmd;