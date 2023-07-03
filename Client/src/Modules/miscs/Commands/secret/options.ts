import { SlashCommandBuilder } from "discord.js";

export default new SlashCommandBuilder()
    .setName("secret")
    .setDescription("🔒 Set the client secret of the bot.")
    .addStringOption(option => option
        .setName("secret")
        .setDescription("🔒 The client secret of the bot.")
        .setRequired(true)
    );