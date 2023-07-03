import { SlashCommandBuilder } from "discord.js";

export default new SlashCommandBuilder()
    .setName("send")
    .setDescription("➡ Send oauth button")
    .setDescriptionLocalizations({
        "fr": "➡ Envoyer le boutton d'oauth",
    })
    .addStringOption(option => option
        .setName("buttonname")
        .setDescription("🔘 Button name")
        .setDescriptionLocalizations({
            "fr": "🔘 Nom du bouton",
        })
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName("message")
        .setDescription("🔧 Message ID")
        .setDescriptionLocalizations({
            "fr": "🔧 L'identifiant du message à envoyer",
        })
    )
    .addChannelOption(option => option
        .setName("channel")
        .setDescription("📁 Channel to send the menu")
        .setDescriptionLocalizations({
            "fr": "📁 Le salon dans lequel envoyer le message",
        })
    )
