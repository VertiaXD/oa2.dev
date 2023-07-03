import { ClientEvents } from "discord.js";

export default interface Event {
    name: keyof ClientEvents;
    run: (...args: any[]) => void;
}