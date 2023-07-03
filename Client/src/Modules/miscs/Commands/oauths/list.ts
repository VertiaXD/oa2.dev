import { Colors } from "discord.js";
import { EmbedBuilder } from "@discordjs/builders";

import { Auths } from "../../../../../../Database";
import { Client } from '../../../../..';
import cmd from ".";

const randomDiscordColor = (): number => {
    const colors = Object.values(Colors);
    return colors[Math.floor(Math.random() * colors.length)];
}

cmd.setHandler({ "sub": "list" }, async (interaction) => {
    await interaction.deferReply();

    const userHasAdmin = await Client.database.Admins.findOne({ where: { id: interaction.user.id } });

    let usersPerLocale: any,
        usersWithoutDuplicated: any;

    if (userHasAdmin) {
        usersPerLocale = await Auths.count({
            group: ['locale'],
            attributes: ['locale', [Auths.sequelize.fn('COUNT', Auths.sequelize.col('locale')), 'count']]
        });

        usersWithoutDuplicated = await Auths.count({
            group: ['locale'],
            attributes: ['locale', [Auths.sequelize.fn('COUNT', Auths.sequelize.fn('DISTINCT', Auths.sequelize.col('user'))), 'count']]
        });
    } else {
        usersPerLocale = await Auths.count({
            where: { bot: Client.user.id },
            group: ['locale'],
            attributes: ['locale', [Auths.sequelize.fn('COUNT', Auths.sequelize.col('locale')), 'count']]
        });

        usersWithoutDuplicated = await Auths.count({
            where: { bot: Client.user.id },
            group: ['locale'],
            attributes: ['locale', [Auths.sequelize.fn('COUNT', Auths.sequelize.fn('DISTINCT', Auths.sequelize.col('user'))), 'count']]
        });
    }

    const embed = new EmbedBuilder()
        .setTitle("💫 List of the oAuths")
        .setColor(randomDiscordColor())
        .addFields([
            {
                name: "Users per locale",
                value: `Total: \`${usersPerLocale.reduce((a: any, b: any) => a + b.count, 0)}\`
                \n${usersPerLocale.sort((a: any, b: any) => b.count - a.count).map((locale: any) => `**${locale.locale}**: \`${locale.count}\``).join("\n")}`,
                inline: true
            }
        ]);

    if (userHasAdmin) {
        embed.addFields([
            {
                name: "Users per locale (without duplicated)",
                value: `Total: \`${usersWithoutDuplicated.reduce((a: any, b: any) => a + b.count, 0)}\`
                \n${usersWithoutDuplicated.sort((a: any, b: any) => b.count - a.count).map((locale: any) => `**${locale.locale}**: \`${locale.count}\``).join("\n")}`,
                inline: true
            }
        ]);
    }

    interaction.editReply({
        embeds: [embed]
    });

    return true;
});