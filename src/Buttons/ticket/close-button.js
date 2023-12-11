const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
require('dotenv').config();

const button = new ActionRowBuilder()
.addComponents(
    new ButtonBuilder()
        .setCustomId('confirm-button')
        .setLabel('🔒 Confirm')
        .setStyle(ButtonStyle.Primary),

);

module.exports = {
    name: 'close-button',

    runInteraction: async (client, interaction, guildSettings, userSettings) => {

        const embed = {
            description : `**${interaction.user.username}**, êtes-vous sûr de vouloir fermer ce ticket ?`,
            
            footer : {
                text : `Equipe Tokimeku`,
            },
        }

        await interaction.reply({ embeds : [ embed ], components: [ button ]});

    }
};