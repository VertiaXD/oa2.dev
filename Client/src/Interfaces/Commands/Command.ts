import { CommandInteraction } from "discord.js"

export default interface Command {
    (interaction: CommandInteraction)
}