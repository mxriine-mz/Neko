const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');


module.exports = {
    name: 'clear',
    category: 'moderation',
    permissions: PermissionFlagsBits.ViewChannel,
    ownerOnly: false,
    usage: 'clear <nombre de messages> <@target>',
    examples: ['clear 10', 'clear 100 @.yumii'], 
    description: 'Supprime un nombre de messages spécifié',

    run: async (client, message, args, guildSettings, userSettings) => {
        
        const amountToDelete = args[0];

        if (!args[0] || amountToDelete < 1 || amountToDelete > 100) {
            return message.channel.send('Le nombre de messages à supprimer doit être compris entre 1 et 100');
        }
        const target = message.mentions.users.find(u => u.id);
        await message.delete();

        const messagesToDelete = await message.channel.messages.fetch();

        if (target) {
            let i = 0;
            const filteredTargetMessages = [];
            (await messagesToDelete).filter(msg => {
                if (msg.author.id === target.id && i < amountToDelete) {
                    filteredTargetMessages.push(msg);
                    i++;
                }
            });

            await message.channel.bulkDelete(filteredTargetMessages, true).then(() => {
                message.channel.send(`Suppression de ${i} messages de **${target.username}**`)
                .then (msg => {
                    setTimeout(() => 
                        msg.delete()
                    , 5000);
                });
            });
            
        } else {
            await message.channel.bulkDelete(amountToDelete, true).then(() => {
                message.channel.send(`Suppression de ${amountToDelete} messages`)
                .then (msg => {
                    setTimeout(() => 
                        msg.delete()
                    , 5000);
                });
                
            });
        }

    },

    options: [
        {
            name: 'nombre',
            description: 'Nombre de messages à supprimer',
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },
        {
            name: 'target',
            description: 'Cible de l\'évènement',
            type: ApplicationCommandOptionType.User,
            required: false,
        },
        {
            name: 'message',
            description: 'ID du message à supprimer',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    ],

    runInteraction: async (client, interaction, guildSettings, userSettings) => {
        const amountToDelete = interaction.options.getInteger('nombre');

        if (amountToDelete < 1 || amountToDelete > 100) {
            return interaction.reply({ 
                content: 'Le nombre de messages à supprimer doit être compris entre 1 et 100', ephemeral: true
            });
        }

        const messageToDelete = interaction.options.getString('message');

        const target = interaction.options.getUser('target');

        const messagesToDelete = await interaction.channel.messages.fetch();

        if (messageToDelete) {
            const message = await interaction.channel.messages.fetch(messageToDelete);
            await message.delete();

            return interaction.reply({ content: `Suppression du message **${messageToDelete}**`, ephemeral: false });
        }


        if (target) {
            let i = 0;
            const filteredTargetMessages = [];
            (await messagesToDelete).filter(msg => {
                if (msg.author.id === target.id && i < amountToDelete) {
                    filteredTargetMessages.push(msg);
                    i++;
                }
            });

            await interaction.channel.bulkDelete(filteredTargetMessages, true).then(() => {
                interaction.reply({ content: `Suppression de ${i} messages de **${target.username}**`, ephemeral: false });

                setTimeout(() => {
                    interaction.deleteReply();
                }, 5000);

            });
        } else {
            await interaction.channel.bulkDelete(amountToDelete, true).then(() => {
                interaction.reply({ content: `Suppression de ${amountToDelete} messages`, ephemeral: false });

                setTimeout(() => {
                    interaction.deleteReply();
                }, 5000);
            });
        }

    }

};