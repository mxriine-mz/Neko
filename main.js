const { Client, GatewayIntentBits, Events, Collection, Partials } = require("discord.js")
const mongoose = require('mongoose')
const Logger = require('./src/Loaders/Logger')

require('dotenv').config()

const client = new Client({
    intents: [
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildBans,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildPresences,
      
    ],
    partials: [
        Partials.Channel
    ],
  });

['commands', 'buttons', 'selects'].forEach(x => client[x] = new Collection());

['loadEvents', 'loadCommands', 'loadButtons', 'loadSelects'].forEach(handler => { require (`./src/Loaders/${handler}`)(client)});
require('./src/Loaders/Functions')(client);

process.on('exit', code => {
  console.log(`Le processus s'est arrêté avec le code: ${code}!`) 
});

process.on('uncaughtException', (err, origin) => {
  console.log(`UNCAUGHT_EXCEPTION: ${err}`, `Origine: ${origin}`)
});

process.on('unhandledRejection', (reason, promise) => {
  console.log(`UNHANDLED_REJECTION: ${reason}\n-----\n`, promise)
});

process.on('warning', (...args) => console.log(...args));


mongoose.set('strictQuery', true);
mongoose.connect(process.env.DATABASE_URI, {  
  autoIndex: false,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
}).then(() => { Logger.client('- connecté à la base de données'); })
.catch(err => { Logger.error(err); });

client.login(process.env.TOKEN)