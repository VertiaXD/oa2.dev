import { SlashCommandBuilder } from "discord.js";

export default new SlashCommandBuilder()
    .setName("owners")
    .setDescription("☀️ Owner Manager")
    .setDescriptionLocalizations({
        "fr": "☀️ Gestionnaire des propriétaires"
    })
    .addSubcommand(subcommand => subcommand
        .setName("add")
        .setDescription("🏭 Add a user to the owners")
        .setDescriptionLocalizations({
            "fr": "🏭 Ajoute une personne à la liste des propriétaires"
        })
        .addUserOption(option => option
            .setName("user")
            .setDescription("User to add to the owners")
            .setDescriptionLocalizations({
                "fr": "Personne à ajouter à la liste des propriétaires"
            })
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand => subcommand
        .setName("remove")
        .setDescription("♻️ Remove a user from the owners")
        .setDescriptionLocalizations({
            "fr": "♻️ Retire une personne de la liste des propriétaires"
        })
        .addUserOption(option => option
            .setName("user")
            .setDescription("User to remove from the owners")
            .setDescriptionLocalizations({
                "fr": "Personne à retirer de la liste des propriétaires"
            })
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand => subcommand
        .setName("list")
        .setDescription("🦀 List all the owners")
        .setDescriptionLocalizations({
            "fr": "🦀 Liste toutes les personnes propriétaires"
        })
    )