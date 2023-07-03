// console.clear();

import { GatewayIntentBits, Partials } from 'discord.js';
import moment from 'moment';
import ExtendedClient from './src/Class/Client';

moment().locale('fr');

export const Client = new ExtendedClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.GuildMember
    ]
});

// Catching errors
process.on('unhandledRejection', (err) => {
    console.log(err);
});