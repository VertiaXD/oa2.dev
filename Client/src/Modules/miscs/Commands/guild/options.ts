import { SlashCommandBuilder } from "discord.js";

export default new SlashCommandBuilder()
    .setName("guild")
    .setDescription("🍇 Guild")
    .setDescriptionLocalizations({
        "fr": "🍇 Gestion d'un serveur"
    })
    .addSubcommand(subcommand => subcommand
        .setName("invite")
        .setDescription("📨 Create an invite")
        .setDescriptionLocalizations({
            "fr": "📨 Créer une invitation"
        })
        .addStringOption(option => option
            .setName("server")
            .setDescription("🌐 Server ID")
            .setDescriptionLocalizations({
                "fr": "🌐 ID du serveur"
            })
            .setRequired(true)
        )
    )