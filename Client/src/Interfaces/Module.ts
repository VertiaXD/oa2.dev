import Command from "../Class/Commands";
import { Event } from ".";

export default interface Module {
    Events: Event[];
    Commands: Command[];
}