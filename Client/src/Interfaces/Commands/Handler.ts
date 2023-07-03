import { ChatInputCommandInteraction } from "discord.js";

export default interface Handler {
    function: (interaction: ChatInputCommandInteraction) => Promise<boolean>;
}