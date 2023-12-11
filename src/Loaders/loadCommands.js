const { ApplicationCommandType, PermissionFlagsBits, InteractionType } = require('discord.js');
const { promisify } = require('util');
const { glob } = require('glob');
const Logger = require('../Loaders/Logger');

const pGlob = promisify(glob);

module.exports = async (client) => {
    (await pGlob(`${process.cwd()}/src/Commands/*/*.js`)).map(async (cmdFile) => {
        const commands = require(cmdFile);

        if(commands.type == InteractionType.ApplicationCommandAutocomplete) {
            return;
        }
        
        if (!commands.name) {
            return Logger.warn(`Commande non-déclenchée: ajouter un nom à votre commande ↓\n Fichier -> ${cmdFile}`);
        }

        if (!commands.description && commands.type !== ApplicationCommandType.User) {
            return Logger.warn(`Commande non-déclenchée: ajouter une description à votre commande ↓\n Fichier -> ${cmdFile}`);
        }

        if (!commands.category) {
            return Logger.warn(`Commande non-déclenchée: ajouter une catégorie à votre commande ↓\n Fichier -> ${cmdFile}`);
        }

        if (!commands.permissions ) {
            return Logger.warn(`Commande non-déclenchée: ajouter une/des permission(s) à votre commande ↓\n Fichier -> ${cmdFile}`);
        }

        if (commands.ownerOnly == undefined ) {
            return Logger.warn(`Commande non-déclenchée: indiquer si la commande est OwnerOnly ↓\n Fichier -> ${cmdFile}`);
        }

        if (!commands.usage) {
            return Logger.warn(`Commande non-déclenchée: ajouter une utilisation (usage) à votre commande ↓\n Fichier -> ${cmdFile}`);
        }

        if (!commands.examples) {
            return Logger.warn(`Commande non-déclenchée: ajouter des exemples à votre commande ↓\n Fichier -> ${cmdFile}`);
        }

        Object.keys(commands.permissions).forEach(permission => {
            if (!permissionList.includes(permission)) {
                return Logger.typo(`Commande non-déclenché: erreur de typo sur la permission '${permission} ↓\n Fichier -> ${cmdFile}`);
            }
            
        });
    
        client.commands.set(commands.name, commands);
        Logger.command(`- ${commands.name}`)

    });
};

const permissionList = [ PermissionFlagsBits.AddReactions, PermissionFlagsBits.Administrator, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.BanMembers,
PermissionFlagsBits.ChangeNickname, PermissionFlagsBits.Connect, PermissionFlagsBits.CreateInstantInvite, PermissionFlagsBits.CreatePrivateThreads,
PermissionFlagsBits.CreatePublicThreads, PermissionFlagsBits.DeafenMembers, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.KickMembers, PermissionFlagsBits.ManageChannels,
PermissionFlagsBits.ManageEmojisAndStickers, PermissionFlagsBits.ManageEvents, PermissionFlagsBits.ManageGuild, PermissionFlagsBits.ManageMessages,
PermissionFlagsBits.ManageNicknames, PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageThreads, PermissionFlagsBits.ManageWebhooks,
PermissionFlagsBits.MentionEveryone, PermissionFlagsBits.ModerateMembers, PermissionFlagsBits.MoveMembers, PermissionFlagsBits.MuteMembers,
PermissionFlagsBits.PrioritySpeaker, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.RequestToSpeak, PermissionFlagsBits.SendMessages,
PermissionFlagsBits.SendMessagesInThreads, PermissionFlagsBits.SendTTSMessages, PermissionFlagsBits.Speak, PermissionFlagsBits.Stream, PermissionFlagsBits.UseApplicationCommands,
PermissionFlagsBits.UseEmbeddedActivities, PermissionFlagsBits.UseExternalEmojis, PermissionFlagsBits.UseExternalStickers, PermissionFlagsBits.UseVAD,
PermissionFlagsBits.ViewAuditLog, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ViewGuildInsights,
];