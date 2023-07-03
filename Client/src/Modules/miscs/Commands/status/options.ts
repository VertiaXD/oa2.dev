import { SlashCommandBuilder } from "discord.js";

export default new SlashCommandBuilder()
    .setName("status")
    .setDescription("📊 Status of the bot")
    .setDescriptionLocalizations({
        "fr": "📊 Statut du bot",
    })
    .addSubcommand(subcommand => subcommand
        .setName('state')
        .setDescription('🈲 Set the state of the bot')
        .setDescriptionLocalizations({
            "fr": "🈲 Définir l'état du bot",
        })
        .addStringOption(option => option
            .setName('state')
            .setDescription('The state of the bot')
            .setDescriptionLocalizations({
                "fr": "L'état du bot",
            })
            .setRequired(true)
            .addChoices(
                { name: 'Online', value: 'online' },
                { name: 'Do Not Disturb', value: 'dnd' },
                { name: 'Idle', value: 'idle' },
                { name: 'Invisible', value: 'invisible' }
            )
        )
    )
    .addSubcommand(subcommand => subcommand
        .setName('activity')
        .setDescription('🌦 Set the activity of the bot')
        .setDescriptionLocalizations({
            "fr": "🌦 Définir l'activité du bot",
        })
        .addStringOption(option => option
            .setName('activity')
            .setDescription('The activity of the bot')
            .setDescriptionLocalizations({
                "fr": "L'activité du bot",
            })
            .setRequired(true)
            .addChoices(
                { name: 'Playing', value: 'playing' },
                { name: 'Streaming', value: 'streaming' },
                { name: 'Listening', value: 'listening' },
                { name: 'Watching', value: 'watching' }
            )
        )
        .addStringOption(option => option
            .setName('name')
            .setDescription('The name of the activity')
            .setDescriptionLocalizations({
                "fr": "Le nom de l'activité",
            })
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('url')
            .setDescription('The url of the activity')
            .setDescriptionLocalizations({
                "fr": "L'url de l'activité",
            })
            .setRequired(false)
        )
    )