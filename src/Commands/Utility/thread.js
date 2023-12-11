const { PermissionFlagsBits, ApplicationCommandOptionType, ChannelType, hideLinkEmbed } = require('discord.js');
const dayjs = require('dayjs');

module.exports = {
    name: 'thread',
    category: 'utility',
    permissions: PermissionFlagsBits.CreatePrivateThreads,
    ownerOnly: false,
    usage: 'thread <create|close|archive|unarchive|list>',
    examples: 'thread create',
    description: 'Create a thread',

    run: async (client, message, args, guildSettings, userSettings) => {

        let thread = message.channel;

        if (!args[0] || !args[0].match(/^(create|delete|archive|unarchive|lock|unlock|modify)$/i)) return message.reply('Veuillez indiquer une action valide !');

        if (args[0] === 'create') {

            const type = args[1];
            const name = args[2];
            const content = args.slice(3).join(' ');

            if (!name) return message.reply('Veuillez indiquer un nom pour le thread !');
            if (!content) return message.reply('Veuillez indiquer un contenu pour le thread !');

            if (type === 'public') {
                const thread = await message.channel.threads.create({
                    name: name,
                    autoArchiveDuration: 60,
                    type: ChannelType.PublicThread,
                    reason: 'Thread créé par le bot',
                });

                await thread.send({content : `**THREAD** ! . . . \`${dayjs().format('DD/MM/YY')}\`・by ${message.author} ; \n ` + content});

                await message.delete();
            
            } else if (type === 'private') {
                const thread = await message.channel.threads.create({
                    name: name,
                    autoArchiveDuration: 60,
                    type: ChannelType.PrivateThread,
                    reason: 'Thread créé par le bot',
                });

                await thread.send({content : `**THREAD** ! . . . \`${dayjs().format('DD/MM/YY')}\`・by ${message.author} ; \n ` + content});

                await message.delete();

            }

        } else if (args[0] === 'delete') {

            if (!thread.isThread()) return message.reply('Vous ne pouvez pas utiliser cette commande ici !');

            const channelId = args[1];

            if (!args[1]) return message.reply('Veuillez indiquer un channel !');

            const logChannel = client.channels.cache.get(channelId);
            logChannel.send(`Le thread **${thread.name}** - ouvert par <@${thread.ownerId}> ; a été supprimé !`).then ( msg => msg.delete({ timeout: 5000 }));
            await thread.delete();

        } else if (args[0] === 'archive') {

            if (!thread.isThread()) return message.reply('Vous ne pouvez pas utiliser cette commande ici !');
            if (thread.archived) return message.reply('Le thread est déjà archivé !');
                
            message.reply('Le thread est archivé !');
            await thread.setArchived(true);
    
        } else if (args[0] === 'unarchive') {

            if (!thread.isThread()) return message.reply('Vous ne pouvez pas utiliser cette commande ici !');
            if (!thread.archived) return message.reply('Le thread n\'est pas archivé !');
    
            message.reply('Le thread est désarchivé !');
            await thread.setArchived(false);
    
        } else if (args[0] === 'lock') {

            if (!thread.isThread()) return message.reply('Vous ne pouvez pas utiliser cette commande ici !');
            if (thread.locked) return message.reply('Le thread est déjà verrouillé !');

            message.reply('Le thread est verrouillé !');
            await thread.setLocked(true);

        } else if (args[0] === 'unlock') {

            if (!thread.isThread()) return message.reply('Vous ne pouvez pas utiliser cette commande ici !');
            if (!thread.locked) return message.reply('Le thread n\'est pas verrouillé !');

            message.reply('Le thread est déverrouillé !');
            await thread.setLocked(false);

        } else if (args[0] === 'modify') {

            if (!thread.isThread()) return message.reply('Vous ne pouvez pas utiliser cette commande ici !');

            if (!args[1]) return message.reply('Veuillez indiquer ce que vous aimerai modifier pour le thread !');

            if (args[1] === 'name') {

                const name = args[2];

                if (!name) return message.reply('Veuillez indiquer un nouveau nom pour le thread !');
                if (name === thread.name) return message.reply(`Le nom du thread est déjà ${name} !`);
                if (name.length > 100) return message.reply('Le nom du thread ne peut pas dépasser 100 caractères !');
                if (name.length < 2) return message.reply('Le nom du thread doit contenir au moins 2 caractères !');

                await thread.setName(name);

                message.reply(`Le nom du thread a été modifié par ${name}!`);

        }  else if (args[1] === 'slowmode') {

            const slowmode = args[2];

            if (!slowmode) return message.reply('Veuillez indiquer un nouveau slowmode pour le thread !');
            if (slowmode === thread.rateLimitPerUser) return message.reply(`Le slowmode du thread est déjà ${slowmode} !`);
            if (slowmode > 21600) return message.reply('Le slowmode du thread ne peut pas dépasser 21600 secondes !');
            if (slowmode < 0) return message.reply('Le slowmode du thread ne peut pas être inférieur à 0 !');

            await thread.setRateLimitPerUser(slowmode);
        
        }
    
        }
    },

    options: [
        {
            name: 'create',
            description: 'Create a thread',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'type',
                    description: 'Type of thread *(public or private)*',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: 'nom',
                    description: 'Name of thread',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: 'contenu',
                    description: 'Content of thread',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
                
        },
        {
            name: 'delete',
            description: 'Delete a thread',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: 'Channel of thread',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        },
        {
            name: 'archive',
            description: 'Archive a thread',
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'unarchive',
            description: 'Unarchive a thread',
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'lock',
            description: 'Lock a thread',
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'unlock',
            description: 'Unlock a thread',
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'modify',
            description: 'Modify a thread',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'name',
                    description: 'Name of thread',
                    type: ApplicationCommandOptionType.String,
                    required: false,
                },
                {
                    name: 'slowmode',
                    description: 'Slowmode of thread',
                    type: ApplicationCommandOptionType.Integer,
                    required: false,
                },
            ],
        },
    ],

    runInteraction: async (client, interaction, guildSettings, userSettings) => {

        if (interaction.options.getSubcommand() === 'create') {

            let type = interaction.options.getString('type');
            let name = interaction.options.getString('nom');
            let content = interaction.options.getString('contenu');

            if (type === 'public') {
                const thread = await interaction.channel.threads.create({
                    name: name,
                    autoArchiveDuration: 60,
                    type: ChannelType.PublicThread,
                    reason: 'Thread créé par le bot',
                });

                await thread.send({content : `**THREAD** ! . . . \`${dayjs().format('DD/MM/YY')}\`・by ${interaction.user} ; \n ` + content});

                interaction.reply({ content : 'Le thread a été créé !', ephemeral: true});
                interaction.deleteReply({ timeout: 1000 });
            
            } else if (type === 'private') {
                const thread = await interaction.channel.threads.create({
                    name: name,
                    autoArchiveDuration: 60,
                    type: ChannelType.PrivateThread,
                    reason: 'Thread créé par le bot',
                });

                await thread.send({content : `**THREAD** ! . . . \`${dayjs().format('DD/MM/YY')}\`・by ${interaction.user} ; \n ` + content});

                interaction.reply({ content : 'Le thread a été créé !', ephemeral: true});

            }
        } else if (interaction.options.getSubcommand() === 'delete') {

            const thread = interaction.channel;

            if (!thread.isThread()) return interaction.reply('Vous ne pouvez pas utiliser cette commande ici !');

            const channelId = interaction.options.getString('channel');

            const logChannel = client.channels.cache.get(channelId);
            logChannel.reply(`Le thread **${thread.name}** ; a été supprimé !`).then ( msg => msg.delete({ timeout: 5000 }));
            await thread.delete();
        } else if (interaction.options.getSubcommand() === 'archive') {

            const thread = interaction.channel;

            if (!thread.isThread()) return interaction.reply('Vous ne pouvez pas utiliser cette commande ici !');
            if (thread.archived) return interaction.reply('Le thread est déjà archivé !');

            await interaction.reply('Le thread est archivé !');
            interaction.deleteReply({ timeout: 5000 });

            await thread.setArchived(true);

        } else if (interaction.options.getSubcommand() === 'unarchive') {

            const thread = interaction.channel;

            if (!thread.isThread()) return interaction.reply('Vous ne pouvez pas utiliser cette commande ici !');

            interaction.reply('Le thread est désarchivé !');
            interaction.deleteReply({ timeout: 5000 });

            await thread.setArchived(false);
            
        } else if (interaction.options.getSubcommand() === 'lock') {

            const thread = interaction.channel;

            if (!thread.isThread()) return interaction.reply('Vous ne pouvez pas utiliser cette commande ici !');

            await thread.setLocked(true);

            interaction.reply('Le thread est verrouillé !');
            interaction.deleteReply({ timeout: 5000 });

        } else if (interaction.options.getSubcommand() === 'unlock') {

            const thread = interaction.channel;

            if (!thread.isThread()) return interaction.reply('Vous ne pouvez pas utiliser cette commande ici !');

            await thread.setLocked(false);

            interaction.reply('Le thread est déverrouillé !');
            interaction.deleteReply({ timeout: 5000 });

        } else if (interaction.options.getSubcommand() === 'modify') {

            const thread = interaction.channel;

            if (!thread.isThread()) return interaction.reply('Vous ne pouvez pas utiliser cette commande ici !');

            const name = interaction.options.getString('name');
            const slowmode = interaction.options.getInteger('slowmode');

            if (name) {
                await thread.setName(name);
                interaction.reply(`Le nom du thread a été modifié par **${name}** *!*`);
            } else if (slowmode) {
                await thread.setRateLimitPerUser(slowmode);
                interaction.reply(`Le slowmode du thread a été modifié, il est de **${slowmode}** secondes *!*`);
            }
        }
        
    },
    
};
