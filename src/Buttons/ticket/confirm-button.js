const { PermissionFlagsBits } = require('discord.js');
const { createTicketButton } = require('../../Assets/Buttons/TicketButton.js');
require('dotenv').config();

module.exports = {
    name: 'confirm-button',

    runInteraction: async (client, interaction, guildSettings, userSettings) => {

        const close = createTicketButton(interaction).components[0];
        const reopen = createTicketButton(interaction).components[1];

        const embed = {
            description : `**${interaction.user.username}**, vous avez fermé ce ticket.\n Celui-ci sera archivé dans la catégorie **辰, TICKETS _** `,
            
            footer : {
                text : `Equipe Tokimeku`,
            },
        }

        await close.setDisabled(true);
        await reopen.setDisabled(false);

        await interaction.guild.channels.edit(interaction.channel.id, {
                permissionOverwrites: [
                    {
                        id: interaction.user.id,
                        deny: [PermissionFlagsBits.SendMessages],
                    },
                ],
            });

        //modifier le bouton close pour qu'il ne soit plus cliquable
        
        await interaction.update({ components : [createTicketButton(interaction)] });
        await interaction.followUp({ embeds : [ embed ]});

    }
};