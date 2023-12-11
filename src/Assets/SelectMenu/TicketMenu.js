const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

function createTicketMenu(client) {
    const TicketMenu = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('ticket-menu')
                .setPlaceholder('Ouvrir un ticket')
                .addOptions({
                    label: 'Ouvrir un ticket',
                    value: 'Ouvrir un ticket',
                    default: true,
                },
                {
                    label: 'J\'aimerai signaler le comportement de quelqu\'un',
                    description: 'Notre personnel est à votre écoute !',
                    value: 'J\'aimerai signaler le comportement de quelqu\'un',
                    emoji: '🗯️',
                },
                {
                    label: 'Quelqu\'un me met mal à l\'aise',
                    description: 'Notre personnel peut vous aider !',
                    value: 'Quelqu\'un me met mal à l\'aise',
                    emoji: '💦',
                },
                {
                    label: 'Je suis confus quant on fonctionnement du serveur',
                    description: 'Notre personnel peut vous guider à travers tout !',
                    value: 'Je suis confus quant on fonctionnement du serveur',
                    emoji: '🤔',
                },
                {
                    label: 'Je souhaite signaler un bug',
                    description: 'Oups, laissez-nous vous la réparer pour vous !',
                    value: 'Je souhaite signaler un bug',
                    emoji: '⚙️',
                },
                {
                    label: 'Je souhaites rejoindre l\'équipe Tokimeku',
                    description: 'Nous sommes toujours à la recherche de nouveaux partenaires !',
                    value: 'Je souhaites rejoindre l\'équipe Tokimeku',
                    emoji: '🤝',
                }
                )
            );

    return TicketMenu;
}
  
module.exports = { createTicketMenu };