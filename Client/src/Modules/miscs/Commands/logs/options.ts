import { SlashCommandBuilder } from "discord.js";

export default new SlashCommandBuilder()
    .setName("logs")
    .setDescription("👻 Define the webhook url for the logs")
    .setDescriptionLocalizations({
        "fr": "👻 Définir l'url du webhook pour les logs"
    })
    .addStringOption(option => option
        .setName("url")
        .setDescription("🔗 Webhook url")
        .setDescriptionLocalizations({
            "fr": "🔗 Url du webhook"
        })
        .setRequired(true)
    )