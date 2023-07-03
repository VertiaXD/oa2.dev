import { SlashCommandBuilder } from "discord.js";

export default new SlashCommandBuilder()
    .setName("role")
    .setDescription("💙 Define the role to give after the verification")
    .setDescriptionLocalizations({
        "fr": "💙 Définir le rôle à donner après la vérification",
    })
    .addRoleOption(option => option
        .setName("role")
        .setDescription("The role to give after the verification")
        .setDescriptionLocalizations({
            "fr": "Le rôle à donner après la vérification"
        })
        .setRequired(true)
    )