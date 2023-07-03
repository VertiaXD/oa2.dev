import Event from '../../../Interfaces/Event';
import ExtendedClient from "../../../Class/Client";

export const logging: Event = {
    name: 'ready',
    run: (client: ExtendedClient) => {
        client.libs.log.print(`Logged in as %s`, 'Discord').success(client.user?.tag);
    }
}