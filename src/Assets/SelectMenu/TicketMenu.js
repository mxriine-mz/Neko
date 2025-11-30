const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

function createTicketMenu() {

    const options = [
        {
            label: "Signaler le comportement de quelqu’un",
            description: "Notre personnel est à votre écoute !",
            value: "report",
            emoji: "<:rightangerbubble:1444701684629766305>",
        },
        {
            label: "Quelqu’un me met mal à l’aise",
            description: "Notre équipe peut vous aider !",
            value: "creepy",
            emoji: "<:sweatdroplets:1444701685904834671>",
        },
        {
            label: "Je suis confus sur le fonctionnement du serveur",
            description: "Nous pouvons vous guider à travers tout !",
            value: "confused",
            emoji: "<:thinkingface:1444701686898753647>",
        },
        {
            label: "Je souhaite signaler un bug",
            description: "Oups, laissez-nous le réparer pour vous !",
            value: "bug",
            emoji: "<:gear:1444701683396645086>",
        },
        {
            label: "Je souhaite rejoindre l’équipe Tokimeku",
            description: "Nous recherchons toujours de nouveaux partenaires !",
            value: "join_team",
            emoji: "<:handshake:1444729910601060493>",
        }
    ];

    const menu = new StringSelectMenuBuilder()
        .setCustomId("ticket-menu")
        .setPlaceholder("📩 Ouvrir un ticket")
        .addOptions(options);

    return new ActionRowBuilder().addComponents(menu);
}

module.exports = { createTicketMenu };
