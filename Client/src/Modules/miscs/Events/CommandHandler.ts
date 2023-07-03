import { Interaction } from 'discord.js';
import Commands from '../../../Class/Commands';
import { Event } from '../../../Interfaces';
import { Client } from '../../../../';

export const CommandHandler: Event = {
    name: 'interactionCreate',
    run: async (interaction: Interaction) => {
        if (!interaction.isChatInputCommand()) return;
        const cmdName = interaction.commandName;

        const BotDB = await Client.database.Bots.findOne({ where: { id: Client.user.id } });
        const userIsAdmin = await Client.database.Admins.findOne({ where: { id: interaction.user.id } });
        if (!userIsAdmin) {
            if (!(BotDB.owners.includes(interaction.user.id) || BotDB.buyer.includes(interaction.user.id))) {
                Client.libs.log.print('User %s is not a bot owner or buyer').warn(interaction.user.id);
                return interaction.reply({ content: '⚠ You don\'t have permission to use this bot !', ephemeral: true }).catch(() => { });
            }
        }

        const blacklist = await Client.database.Blacklist.findOne({ where: { guild: interaction.guild.id } });
        if (blacklist) return interaction.reply({ content: `⚠ This bot is blacklisted on this server !\nReason: \`\`\`${blacklist.reason}\`\`\``, ephemeral: true }).catch(() => { });

        var cmd = Client.Commands.get(cmdName) as Commands;
        if (!cmd) Commands.Error(interaction, cmdName, 'Command not found in Map !', '⚠ Command not found in Map !');

        if (!cmd) {
            if (interaction.deferred) interaction.editReply({ content: '⚠ Command not found in Map !' }).catch(() => { });
            else interaction.reply({ content: '⚠ Command not found in Map !', ephemeral: true }).catch(() => { });

            return;
        }

        const cmdExecute = await cmd.run(interaction).catch(err => {
            if (interaction.deferred) interaction.editReply({ content: `⚠ An error occured !\n${err.message}` }).catch(() => { });
            else Commands.Error(interaction, cmdName, `⚠ An error occured !${err.message}`, err);

            console.log(err);

            return false;
        });

        //* Log the command
        const cmdARGS = interaction.options.data[0]?.options?.map((arg) => ({ [arg.name]: arg.value })) ?? [];

        const subCmd = interaction.options.data.find((arg) => arg.type === 1)?.name ?? "",
            groupSubCmd = interaction.options.data.find((arg) => arg.type === 2)?.name ?? "";

        if (!cmdExecute) {
            Client.database.LogsCommands.create({
                bot: Client.user.id,
                user: interaction.user.id,
                guild: interaction.guild.id,
                command: `${cmdName} ${subCmd} ${groupSubCmd}`,
                args: JSON.stringify(cmdARGS),
                success: false
            }).catch(() => { })
        } else {
            Client.database.LogsCommands.create({
                bot: Client.user.id,
                user: interaction.user.id,
                guild: interaction.guild.id,
                command: `${cmdName} ${subCmd} ${groupSubCmd}`,
                args: JSON.stringify(cmdARGS),
                success: true
            }).catch(() => { });
        }
    }
}