import { Interaction } from 'discord.js';
import { Client } from '../../../..';
import { Auths } from '../../../../../Database';
import { Event } from '../../../Interfaces';

export const AutoCompleteLangs: Event = {
    name: 'interactionCreate',
    run: async (interaction: Interaction) => {
        if (!interaction.isAutocomplete()) return;
        if (interaction.options.getFocused(true).name != 'locale') return;

        let oAuths: Auths[];

        oAuths = await Client.database.Auths.findAll({ where: { bot: Client.user.id }, order: [['id', 'ASC']], raw: true, attributes: ['locale'] });

        // add the quantity of each locale
        var locales = oAuths.map((oAuth) => oAuth.locale);
        locales = locales.filter((locale, index) => locales.indexOf(locale) === index);
        locales = locales.slice(0, 20);
        const quantity = locales.map((locale) => oAuths.filter((oAuth) => oAuth.locale == locale).length);

        interaction.respond(
            locales.map((locale) => ({
                name: locale.charAt(0).toUpperCase() + locale.slice(1) + ` (${quantity[locales.indexOf(locale)]})`,
                value: locale
            }))
        ).catch(() => { })
    }
}