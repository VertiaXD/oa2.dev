import { ApplicationCommandData, ChatInputCommandInteraction, Colors, PermissionResolvable, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";
import { Command } from "../Interfaces";
import { Client } from "../..";

export default class Commands {
    public options: ApplicationCommandData | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;

    public requiredPermissions: PermissionResolvable[] = [];
    public handlers = [];

    constructor(options: ApplicationCommandData | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">, requiredPermissions?: PermissionResolvable[]) {
        this.options = options;
        if (requiredPermissions) this.requiredPermissions = requiredPermissions;
    }

    public setHandler(options: {
        sub?: string,
        subGroup?: string
    }, handler: (interaction: ChatInputCommandInteraction) => Promise<boolean>) {
        this.handlers.push({
            options: options,
            function: handler
        });
    }

    public getHandler(search: { sub?: string, subGroup?: string }): Command.Handler {
        return this.handlers.find(handler => {
            if (search.subGroup) {
                if (handler.options.subGroup && handler.options.sub) {
                    return handler.options.subGroup == search.subGroup && handler.options.sub == search.sub;
                }
            } else if (search.sub) {
                if (handler.options.sub) {
                    return handler.options.sub == search.sub;
                }
            } else return !handler.options.sub && !handler.options.subGroup;
        });
    }

    static Error(interaction: ChatInputCommandInteraction, cmdName: string, description: string, string: string) {
        interaction.reply({
            embeds: [{
                color: Colors.Red,
                description: description,
            }],
            ephemeral: true
        });

        Client.libs.log.print(`%s as trying to execute %s - %s`, "Command").warn(interaction.user.tag, cmdName, string);
    }

    public async run(interaction: ChatInputCommandInteraction) {
        const name = interaction.commandName,
            sub = interaction.options?.getSubcommand(false),
            subGroup = interaction.options?.getSubcommandGroup(false);

        const member = await interaction.guild.members.fetch(interaction.user.id);

        if (this.requiredPermissions.length > 0) {
            const missingPermissions = member.permissions.missing(this.requiredPermissions);
            if (missingPermissions.length > 0) {
                Commands.Error(interaction, name, `You are missing the following permissions: ${missingPermissions.join(", ")}`, "Missing Permissions");
                return;
            }
        }

        var handler = this.getHandler({ sub: sub, subGroup: subGroup });
        if (!handler) return Commands.Error(interaction, name, 'Command as any handler !', 'Command as any handler !');

        const result = await handler.function(interaction);
        Client.libs.log.print(`%s as executing %s.`, "Command").log(interaction.user.tag, name + (sub ? ` ${sub}` : "") + (subGroup ? ` ${subGroup}` : ""));
        return result;
    }
}