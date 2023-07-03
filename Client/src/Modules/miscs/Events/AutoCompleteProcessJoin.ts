import { Interaction } from 'discord.js';

import { Process } from "../Commands/oauths/join";
import { Event } from '../../../Interfaces';

export const AutoCompleteProcessJoin: Event = {
    name: 'interactionCreate',
    run: async (interaction: Interaction) => {
        if (!interaction.isAutocomplete()) return;
        if (interaction.commandName != "oauths" || interaction.options.getSubcommand() != "stop") return;

        if (Process.size == 0) return interaction.respond([]);

        const guildids = [...Process.values()].filter(opts => !opts.stop)

        return interaction.respond(guildids.map(opts => {
            if (opts.interaction.guild == null || opts.interaction.guild.id == null) return null;
            return {
                name: opts.interaction.guild.name ?? opts.interaction.guild.id ?? "Unknown",
                value: opts.interaction.guild.id.toString()
            }
        }));
    }
}