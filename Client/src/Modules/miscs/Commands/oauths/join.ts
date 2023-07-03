import { Colors, CommandInteraction, Guild } from "discord.js";
import { EmbedBuilder } from "@discordjs/builders";

import Request from '../../../../Class/Request';
import { Client } from '../../../../../';
import cmd from ".";
import { Op, Sequelize } from "sequelize";
import randomEmoji from 'random-unicode-emoji';
import moment from "moment";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const Process = new Map<string, {
    promise: Promise<string>,
    interaction: CommandInteraction,
    stop: boolean
}>();

cmd.setHandler({ "sub": "join" }, async (interaction) => {
    await interaction.reply({ content: randomEmoji.random({ count: 1 }).toString(), ephemeral: true });
    var startedDate = moment();
    var guild = interaction.guild as Guild;

    var message = await interaction.channel.send({
        content: `🎡 Join the server.`
    });
    if (!message) {
        interaction.editReply({
            content: '❌ I can\'t send message in this channel',
            components: []
        }).catch(() => { });
        return false;
    }

    var promise = Process.get(interaction.guildId);
    if (promise && !promise.stop) {
        message.edit({
            content: '❌ There is already a join process running in this server',
            components: []
        }).catch(() => { });
        return false;
    } else if (promise && promise.stop) {
        Process.delete(interaction.guildId);
    }

    var args = {
        quantity: interaction.options.get("quantity")?.value as number,
        locale: interaction.options.get('locale')?.value as string,
        interval: parseInt(interaction.options.get('interval')?.value as string)
    }

    var request = new Request();

    var userHasAdmin = await Client.database.Admins.findOne({ where: { id: interaction.user.id } }),
        bot = await Client.database.Bots.findOne({ where: { id: Client.user.id } });

    if (!args.interval) args.interval = 1000;
    if (!userHasAdmin && args.interval < 1000) args.interval = 1000;

    var lastCmdWeek = await Client.database.LogsJoin.findAll({
        where: {
            createdAt: {
                [Op.gt]: moment().subtract(1, "week").toDate()
            },
            bot: Client.user.id
        },
        order: [['createdAt', 'DESC']],
        raw: true
    });

    //! Check if user has reached the maximum number of join per weeks
    if (!userHasAdmin) {
        if (
            (bot.type == 0 && lastCmdWeek.length >= 3) ||
            (bot.type == 1 && lastCmdWeek.length >= 9)
        ) {
            var nextCmdIn = lastCmdWeek.length > 0 ? moment(lastCmdWeek[lastCmdWeek.length - 1].createdAt).add(1, 'week').toDate() : null;
            message.edit({
                content: `❌ You have reached the maximum number of join per weeks, please try again <t:${Math.floor(nextCmdIn.getTime() / 1000)}:R>`,
                components: []
            }).catch(() => { });
            return false;
        }
    }

    //! Log Join
    var logJoin = await Client.database.LogsJoin.create({
        bot: Client.user.id,
        guild: interaction.guildId,
        user: interaction.user.id
    });

    var alreadyOnServer = [],
        success = [],
        error = [],
        expired = [],
        limitServer = [];

    //! Get oAuths
    let oAuths = await Client.database.Auths.findAll({
        where: {
            bot: Client.user.id,
            //? if args.locale is empty, get all locales
            locale: args.locale ? args.locale : { [Op.ne]: null }
        },
        group: ['user'],
        attributes: ['user', 'access_token', 'expireDate'],
        raw: true
    });

    //! Remove expired oAuths
    for (var oAuth of oAuths) {
        if (moment(oAuth.expireDate).isBefore(moment())) {
            expired.push(oAuth.user);
            oAuths = oAuths.filter(o => o.user != oAuth.user);
        }
    }

    await guild.members.fetch();

    //! Remove oAuths already on server
    for (var oAuth of oAuths) {
        var isOnServer = guild.members.cache.get(oAuth.user);
        if (isOnServer) {
            alreadyOnServer.push(oAuth.user);
            oAuths = oAuths.filter(o => o.user != oAuth.user);
        }
    }

    var total = oAuths.length > args.quantity ? args.quantity : oAuths.length;

    var BuildEmbed = () => {
        var e = new EmbedBuilder()
            .addFields([
                { name: '`🤼‍♂️` Total', value: oAuths.length.toString(), inline: true },
                { name: '`🤝` Desired', value: total.toString(), inline: true },
                { name: '`✅` Success', value: success.length.toString(), inline: true },
                { name: '`❌` Already on server', value: alreadyOnServer.length.toString(), inline: true },
                { name: '`☢` Error', value: error.length.toString(), inline: true },
                { name: '`⏰` Expired', value: expired.length.toString(), inline: true },
                { name: '`🚫` Limit Server', value: limitServer.length.toString(), inline: true },
            ]);

        if (bot.type == 0) e.setDescription(`・Powered by **[oa2.dev](https://oa2.dev)**`)

        return e;
    }

    Process.set(interaction.guildId, {
        promise: new Promise(async (resolve, reject) => {
            for (var oAuth of oAuths) {
                var promise = Process.get(interaction.guildId);
                if (promise?.stop == true) return resolve("stopped");

                if (args.quantity && success.length >= args.quantity) {
                    resolve("success");
                    break;
                }

                var isOnServer = guild.members.cache.get(oAuth.user);
                if (isOnServer) {
                    alreadyOnServer.push(oAuth.user);
                    continue;
                }

                await delay(args.interval);
                var join = await request.JoinServer(oAuth.access_token, guild.id, oAuth.user, bot.token);
                if (join == false) {
                    //* Auth already on server
                    // console.log(join);
                    alreadyOnServer.push(oAuth.user);
                } else if (typeof join == "object") {
                    if ('code' in join) {
                        if (join.code == 30001) {
                            //* Server limit
                            limitServer.push(oAuth.user);
                        } else if (join.code == 50025) {
                            //* oAuths error
                            error.push(oAuth.user);
                        }
                    } else if ('user' in join) {
                        if (!join?.user) {
                            //* Auth error
                            error.push(oAuth.user);
                        } else {
                            //* Success
                            success.push(oAuth.user);
                        }
                    } else if ('retry_after' in join) {
                        //* Ratelimit
                        await delay(join.retry_after + 1000);
                    }
                }

                continue;
            }

            return resolve("success");
        }),
        interaction: interaction,
        stop: false
    });

    var replyInterval = setInterval(() => {
        promise = Process.get(interaction.guildId);
        if (promise?.stop) return clearInterval(replyInterval);
        var resfreshEmbed = BuildEmbed();
        resfreshEmbed.setColor(Colors.Orange);
        logJoin.update({
            stats: JSON.stringify({
                total: oAuths.length,
                desired: total,
                success: success.length,
                alreadyOnServer: alreadyOnServer.length,
                error: error.length,
                expired: expired.length,
                limitServer: limitServer.length
            })
        });
        if (message.editable) message.edit({
            content: "",
            embeds: [resfreshEmbed]
        }).catch(() => { });
    }, 1000 * 5);

    await Process.get(interaction.guildId).promise.then(async (data) => {
        promise = Process.get(interaction.guildId);

        var endEmbed = BuildEmbed();
        clearInterval(replyInterval);

        endEmbed.setFooter({
            text: `End At ${moment().format('HH:mm:ss')}`
        });

        if (data === "stopped") {
            endEmbed.setTitle('🔴 Canceled');
            endEmbed.setColor(Colors.Red);

            if (message.editable) await message.edit({
                content: "",
                embeds: [endEmbed],
                components: []
            }).catch(() => { });
        } else {
            endEmbed.setTitle('✅ Finished');
            endEmbed.setColor(Colors.Green);

            if (message.editable) message.edit({
                content: "",
                embeds: [endEmbed],
                components: []
            }).catch(() => { });
        }

        promise.stop = true;
    }).catch(async (err) => {
        console.log(err);
        var endEmbed = BuildEmbed();
        clearInterval(replyInterval);

        endEmbed.setTitle('🔴 Error');
        endEmbed.setColor(Colors.Red);

        if (message.editable) message.edit({
            content: "",
            embeds: [endEmbed],
            components: []
        }).catch(() => { });

        promise.stop = true;
    });

    return true;
});