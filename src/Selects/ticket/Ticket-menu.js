const { ChannelType, PermissionFlagsBits } = require('discord.js');
const { createTicketMenu } = require('../../Assets/SelectMenu/TicketMenu');
const { createTicketButton } = require('../../Assets/Buttons/TicketButton');
require('dotenv').config();

module.exports = {
    name: 'ticket-menu',

    runInteraction: async (client, interaction, guildSettings, userSettings) => {

        const TicketMenu = createTicketMenu(client);
        const TicketButton = createTicketButton();

        const SelectOption = interaction.values[0];

        if(userSettings.ticket == true) return interaction.reply({ content: `**${interaction.user.username}**, vous avez déjà un ticket ouvert.`, ephemeral: true });

        const embed = {
            title: ` TICKET | ${interaction.user.username}`,
            description: `**Votre ticket a été créé ${interaction.user}** \n\n`+
            `Raison : **${SelectOption}** \n`+
            `>>> Veuillez nous fournir toute information supplémentaire que vous jugez utile pour nous aider à répondre plus rapidement.`,

            timestamp: new Date(),
            footer: {
                text: `Equipe Tokimeku`,
                icon_url: client.user.displayAvatarURL({ dynamic: true }),
            },
        };

        const channel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: process.env.TICKET_CATEGORY_ID,
            //seule la personne qui a créé le ticket peut voir le ticket
            permissionOverwrites: [
                {
                    id: interaction.user.id,
                    allow: [PermissionFlagsBits.ViewChannel],
                },
                {
                    id: interaction.guild.roles.everyone,
                    deny: [PermissionFlagsBits.ViewChannel],
                },
            ],
        });

        userSettings.ticket = true;
        userSettings.save();

        await interaction.update({ components : [ TicketMenu ] });

        await interaction.followUp({ content: `**${interaction.user.username}**, votre ticket a été créé avec succès <#${channel.id}>.`, ephemeral: true });

        await channel.send({ embeds : [ embed ], components: [ TicketButton ]});

    }
};