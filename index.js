/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * DSA Bot
 * 
 * A Discord bot originally made for the DSA Esports server, which is now being made as a general-purpose / esports discord bot.
 * 
 * ~~~developed by ggtylerr~~~ 
 */

require("dotenv").config();

/**
 * Wondering where configuration went? 
 * It's now in a more proper place - config.js. 
 * Located in the same folder as this file.
 */

const Config = require('./config');

// Uptime Robot
if (Config.HostWeb) {
  const express = require("express");
  const app = express();

  app.listen(() => console.log("Server started"));

  app.use('/', (req, res) => {
    res.send("Hey there! This is a Discord bot, not a website! If you can't seem to access it, send a message at our <a href=\"https://discord.gg/Nfkdm6vnbD\">support server.</a>");
  });
}

// Packages
var path = require('path');
process.env.appRoot = path.resolve(__dirname);

const Discord = require('discord.js');
const Commando = require('discord.js-commando');
const JsonDB = require('node-json-db').JsonDB;
const DBConfig = require('node-json-db/dist/lib/JsonDBConfig').Config;
const sqlite = require('sqlite');

// Important Variables
client = new Commando.Client({
  owner: process.env.id,
  commandPrefix: Config.DefaultPrefix,
  unknownCommandResponse: Config.UnknownCommand
});
var serverDB = new JsonDB(new DBConfig(process.env.appRoot + "/db/serverDB",true,true,'/'));
serverDB.load();

// Listen Events
if (Config.DebugLogs) client.on('debug',console.log);

client
  .on('error',console.error)
  .on('warn',console.warn)
  .on('ready', () => {
    client.user.setActivity(`for commands (@${client.user.tag} help)`, { type: 'WATCHING' })
      .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
      .catch(console.error);
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    console.log('          DSABOT');
    console.log('        v0.9-dev10');
    console.log('~~~developed by ggtylerr~~~');
    console.log('If you have issues, please');
    console.log(' go to the support server!');
    console.log('   discord.gg/Nfkdm6vnbD');
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    console.log(`Logged in as @${client.user.tag}!`);
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~');
  })
  .on('disconnect', () => console.log('Disconnected and will no longer attempt to reconnect.'))
  .on('reconnecting', () => console.log('Attempting to reconnect...'))
  .on('resume', replays => console.log('WebSocket resumed (we\'re back online.) ' + replays + ' events have been replayed.'))
  .on('commandError', (cmd,err) => {
    if (err instanceof Commando.FriendlyError) return;
    console.error(`Error occured in command ${cmd.groupID}:${cmd.memberName}`,err);
  })
  .on('message', message => {
    serverDB.reload();
    // Return if bot or DMs
    if (message.author.bot || message.channel.guild === undefined || message.channel.guild === null) return;
    // Message count updating
    var id = message.channel.guild.id;
    if (id !== null) {
      try {
        var countData = serverDB.getData(`/${id}/count`) + 1;
        serverDB.push(`/${id}/count`,countData);
      } catch {
        serverDB.push(`/${id}/count`,1);
      }
    }
  });

// Set setting provider
client.setProvider(
  sqlite.open(path.join(__dirname,'db/commando.sqlite3')).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);
// Register Commands
client.registry
  .registerDefaultTypes()
  .registerTypesIn(path.join(__dirname,'types'))
  .registerGroups([
    ['gen','General Commands'],
    ['chlge','Challonge Commands'],
    ['smash','smash.gg Commands'],
    ['sggqu','smash.gg queue Commands'],
    ['meme','Meme Commands'],
    ['nopre','No Prefix Commands'],
    ['music','Music Commands'],
    ['cvd19','COVID-19 Commands'],
    ['admin','Admin Commands']
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({help:false,eval:false,unknownCommand:Config.UnknownCommand})
  .registerCommandsIn(path.join(__dirname,'cmds'));
// Login
client.login(process.env.token);