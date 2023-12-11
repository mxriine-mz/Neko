const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const dayjs = require('dayjs');

module.exports = {
    name: 'mail',
    category: 'info',
    permissions: PermissionFlagsBits.KickMembers,
    ownerOnly: false,
    usage: 'mail',
    examples: ['mail [ message ]'],
    description: 'Envoie un mail d\'annonce à tous les membres du serveur',

    run: async (client, message, args, guildSettings, userSettings) => {

        const ping = args[0];

        const content = args.slice(1).join(' ');

        const mailChannel = client.channels.cache.get(process.env.MAIL_ID);
        mailChannel.send({content : `**MAIL** ! . . . \`${dayjs().format('DD/MM/YY')}\`・ping ${ping} ; \n ` + content});
        
    },

    options: [
        {
            name: 'content',
            description: 'Taper la question de votre sondage',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    async runInteraction (client, interaction) {

        const message = interaction.options.getString('content');

        interaction.reply({content : `⸝⸝・₊ **MAIL** ! . . . \`${dayjs().format('DD/MM/YY')}\`・ping <@&${process.env.MAILS_ID}> ;; \n ` + message});

    },
};