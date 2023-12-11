const { promisify } = require('util');
const { glob } = require('glob');
const Logger = require('../Loaders/Logger');

const pGlob = promisify(glob);

module.exports = async client => {
    (await pGlob(`${process.cwd()}/src/Events/*/*.js`)).map(async eventFile => {
        const event = require(eventFile);

        if (!event.name) {
            return Logger.warn(`Evènement non-déclenché: ajouter un nom à votre évènement ↓\n Fichier -> ${eventFile}`);
        }

        if (!eventList.includes(event.name)) {
            return Logger.typo(`Evenement non-déclenché: erreur de typo ↓\n Fichier -> ${eventFile}\n-----`);
        }

        if (event.once) {
            client.once(event.name, (...args) => event.execute(client, ...args));
        } else {
            client.on(event.name, (...args) => event.execute(client, ...args));
        }

        Logger.event(`- ${event.name}`);
    });
};

const eventList = ['applicationCommandPermissionsUpdate', 'autoModerationActionExecution', 'autoModerationRuleCreate', 'autoModerationRuleDelete', 'autoModerationRuleUpdate', 'channelCreate', 'channelDelete', 'channelPinsUpdate', 'channelUpdate', 'debug', 'emojiCreate', 'emojiDelete', 'emojiUpdate', 'error', 'guildBanAdd', 'guildBanRemove', 'guildCreate', 'guildDelete', 'guildIntegrationsUpdate', 'guildMemberAdd', 'guildMemberAvailable', 'guildMemberRemove', 'guildMembersChunk', 'guildMemberUpdate', 'guildScheduledEventCreate', 'guildScheduledEventDelete', 'guildScheduledEventUpdate', 'guildScheduledEventUserAdd', 'guildScheduledEventUserRemove', 'guildUnavailable', 'guildUpdate', 'interactionCreate', 'invalidated', 'inviteCreate', 'inviteDelete', 'messageCreate', 'messageDelete', 'messageDeleteBulk', 'messageReactionAdd', 'messageReactionRemove', 'messageReactionRemoveAll', 'messageReactionRemoveEmoji', 'messageUpdate', 'presenceUpdate', 'ready', 'roleCreate', 'roleDelete', 'roleUpdate', 'shardDisconnect', 'shardError', 'shardReady', 'shardReconnecting', 'shardResume', 'stageInstanceCreate', 'stageInstanceDelete', 'stageInstanceUpdate', 'stickerCreate', 'stickerDelete', 'stickerUpdate', 'threadCreate', 'threadDelete', 'threadListSync', 'threadMembersUpdate', 'threadMemberUpdate', 'threadUpdate', 'typingStart', 'userUpdate', 'voiceStateUpdate', 'warn', 'webhookUpda'];