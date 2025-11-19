// main.js
const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const mongoose = require("mongoose");
const Logger = require("./src/Loaders/Logger");
const registerDbFunctions = require("./src/Loaders/Functions");
const loadEvents = require("./src/Loaders/loadEvents");
const loadCommands = require("./src/Loaders/loadCommands");
const loadButtons = require("./src/Loaders/loadButtons");
const loadSelects = require("./src/Loaders/loadSelects");

require("dotenv").config();

// ——————————— Client Discord ———————————

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.GuildMember,
    Partials.Reaction,
    Partials.User,
  ],
});

// Collections pour handlers
client.commands = new Collection();
client.buttons  = new Collection();
client.selects  = new Collection();

// Injecte getGuild / createGuild / getUser / etc.
registerDbFunctions(client);

// ——————————— Démarrage ———————————

async function start() {
  try {
    // 1) Connexion Mongo
    if (!process.env.DATABASE_URI) {
      throw new Error("DATABASE_URI manquant dans le .env");
    }

    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.DATABASE_URI, {
      autoIndex: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    });

    Logger.client("- connecté à la base de données");

    // 2) Loaders
    await loadEvents(client);
    await loadCommands(client);
    await loadButtons(client);
    await loadSelects(client);

    Logger.client("- évènements/commandes/boutons/menus chargés");

    // 3) Login Discord
    if (!process.env.TOKEN) {
      throw new Error("TOKEN manquant dans le .env");
    }

    await client.login(process.env.TOKEN);
    Logger.client("- bot connecté à l'API Discord");
  } catch (err) {
    Logger.error(`Échec au démarrage: ${err.stack || err.message || err}`);
    process.exit(1);
  }
}

// ——————————— Gestion erreurs globales ———————————

process.on("unhandledRejection", (reason) => {
  Logger.error(`unhandledRejection: ${reason?.stack || reason}`);
});

process.on("uncaughtException", (err) => {
  Logger.error(`uncaughtException: ${err?.stack || err}`);
});

process.on("warning", (warning) => {
  Logger.warn(`warning: ${warning?.stack || warning}`);
});

// Lancer
start();
