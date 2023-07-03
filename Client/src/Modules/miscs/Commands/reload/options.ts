import { SlashCommandBuilder } from "discord.js";

export default new SlashCommandBuilder()
    .setName("reload")
    .setDescription("🔃 Reload commands")
    .setDescriptionLocalizations({
        "fr": "🔃 Recharge les commandes"
    })