const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'alea',
    category: 'fun',
    permissions: PermissionFlagsBits.KickMembers,
    ownerOnly: false,
    usage: 'alea <message>',
    examples: ['alea'],
    description: 'Choose a random name',

    run: async (client, message, args, guildSettings, userSettings) => {

        const arg1 = args[0];
        if (!arg1) {
            return message.channel.send(`Vous devez saisir au moins un argument *!*`);
        }

        const arg2 = args[1];
        if (!arg2) {
            return message.channel.send(`Vous devez saisir au moins deux arguments *!*`);
        }

        if (arg1 === arg2) {
            return message.channel.send(`Vous devez saisir au moins deux arguments différents *!*`);
        }

        const arg3 = args[2];
        const arg4 = args[3];
        const arg5 = args[4];
        const arg6 = args[5];
        const arg7 = args[6];
        const arg8 = args[7];
        const arg9 = args[8];
        const arg10 = args[9]

        const alea = [arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10]

        if (arg3 === undefined) {
            alea.pop();
        }

        if (arg4 === undefined) {
            alea.pop();
        }

        if (arg5 === undefined) {
            alea.pop();
        }

        if (arg6 === undefined) {
            alea.pop();
        }

        if (arg7 === undefined) {
            alea.pop();
        }

        if (arg8 === undefined) {
            alea.pop();
        }

        if (arg9 === undefined) {
            alea.pop();
        }

        if (arg10 === undefined) {
            alea.pop();
        }

        console.log(alea);

        const response = alea[Math.floor(Math.random() * alea.length)];
        console.log(response);

        message.channel.send(`> Le choix aléatoire est : \`${response}\`!`);

    },

    options: [
        {
            name: 'option1',
            description: 'Choose a random proposition',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'option2',
            description: 'Choose a random proposition',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'option3',
            description: 'Choose a random proposition',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'option4',
            description: 'Choose a random proposition',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'option5',
            description: 'Choose a random proposition',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'option6',
            description: 'Choose a random proposition',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'option7',
            description: 'Choose a random proposition',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'option8',
            description: 'Choose a random proposition',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'option9',
            description: 'Choose a random proposition',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'option10',
            description: 'Choose a random proposition',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    ],

    runInteraction: async (client, interaction, guildSettings, userSettings) => {

        const arg1 = interaction.options.getString('option1');
        const arg2 = interaction.options.getString('option2');
        const arg3 = interaction.options.getString('option3');
        const arg4 = interaction.options.getString('option4');
        const arg5 = interaction.options.getString('option5');
        const arg6 = interaction.options.getString('option6');
        const arg7 = interaction.options.getString('option7');
        const arg8 = interaction.options.getString('option8');
        const arg9 = interaction.options.getString('option9');
        const arg10 = interaction.options.getString('option10');

        const alea = [arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10]

        if (arg3 === null) {
            alea.pop();
        }

        if (arg4 === null) {
            alea.pop();
        }

        if (arg5 === null) {
            alea.pop();
        }

        if (arg6 === null) {
            alea.pop();
        }

        if (arg7 === null) {
            alea.pop();
        }

        if (arg8 === null) {
            alea.pop();
        }

        if (arg9 === null) {
            alea.pop();
        }

        if (arg10 === null) {
            alea.pop();
        }

        console.log(alea);

        const response = alea[Math.floor(Math.random() * alea.length)];
        console.log(response);

        interaction.reply(`> Le choix aléatoire est : \`${response}\`!`);

    },
};