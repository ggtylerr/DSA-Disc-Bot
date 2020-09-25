/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * DSA Bot
 * 
 * A Discord bot originally made for the DSA Esports server, which is now being made as a general-purpose / esports discord bot.
 * 
 * ~~~developed by ggtylerr~~~ 
 */

// ~~~~~~~~~~~~~
// CONFIGURATION
// ~~~~~~~~~~~~~
// Default command prefix. Doesn't have to be one character.
var DefaultPrefix = ';';
// Unknown command response.
// If set to true, the bot will send a message if it's an unknown command.
// Not recommended if it's intended for a public server or you have a bot with a similar prefix.
var UnknownCommand = false;
// Debug log messages.
// If set to true, debug messages will be logged.
// Please note that this includes *every* debug log, including heartbeat messages.
// This might also print your token accidentally.
var DebugLogs = false;
// Web server hosting.
// If set to true, a web server will be set up for use of Uptime Robot.
// Not recommended if you're not on repl.it.
var HostWeb = true;
// ~~~~~~~~~~~~~~~~~~~~~~
//  END OF CONFIGURATION
// ~~~~~~~~~~~~~~~~~~~~~~
//    PLEASE DO NOT GO 
// PAST THIS POINT IF YOU
//    DO NOT KNOW WHAT
//     YOU'RE DOING!!
// ~~~~~~~~~~~~~~~~~~~~~~

// Uptime Robot
if (HostWeb) {
  const express = require("express");
  const app = express();

  app.listen(() => console.log("Server started"));

  app.use('/', (req, res) => {
    res.send("Hey there! This is a Discord bot, not a website! If you can't seem to access it, send a message at our <a href=\"https://discord.gg/N5HnVrA\">support server.</a>");
  });
}

// Packages
var path = require('path');
process.env.appRoot = path.resolve(__dirname);

const Discord = require('discord.js');
const Commando = require('discord.js-commando');
const JsonDB = require('node-json-db').JsonDB;
const Config = require('node-json-db/dist/lib/JsonDBConfig').Config;
const sqlite = require('sqlite');

// Important Variables
global.client = new Commando.Client({
  owner: process.env.id,
  commandPrefix: DefaultPrefix,
  unknownCommandResponse: UnknownCommand
});
var serverDB = new JsonDB(new Config(process.env.appRoot + "/db/serverDB",true,true,'/'));
serverDB.load();

// Listen Events
if (DebugLogs) client.on('debug',console.log);

client
  .on('error',console.error)
  .on('warn',console.warn)
  .on('ready', () => {
    client.user.setActivity(`for commands (@${client.user.tag} help)`, { type: 'WATCHING' })
      .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
      .catch(console.error);
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    console.log('           DSABOT');
    console.log('            v0.8');
    console.log('~~~~developed by ggtylerr~~~~');
    console.log(' If you have issues, please ');
    console.log('  go to the support server!');
    console.log('     discord.gg/N5HnVrA');
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    console.log(`Logged in as @${client.user.tag}!`);
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
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
    ['cvd19','COVID-19 Commands'],
    ['admin','Admin Commands'],
    ['nopre','No Prefix Commands']
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({help:false,eval:false,unknownCommand:UnknownCommand})
  .registerCommandsIn(path.join(__dirname,'cmds'));
// Login
client.login(process.env.token);