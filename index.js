/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * DSA Bot
 * 
 * A Discord bot originally made for the DSA Esports server, which is now being made as a general-purpose / esports discord bot.
 * 
 * ~~~developed by ggtylerr~~~ 
 */

// Uptime Robot
// (Remove if you aren't using Uptime Robot and don't want to host a website)
const express = require("express");
const app = express();

app.listen(() => console.log("Server started"));

app.use('/', (req, res) => {
  res.send(new Date());
});

// Packages
var path = require('path');
global.appRoot = path.resolve(__dirname);

const Discord = require('discord.js');
const Commando = require('discord.js-commando');
const JsonDB = require('node-json-db').JsonDB;
const Config = require('node-json-db/dist/lib/JsonDBConfig').Config;
const sqlite = require('sqlite');

// Important Variables
global.client = new Commando.Client({
  owner: process.env.id,
  commandPrefix: ';', // Default prefix, configure if needed
  unknownCommandResponse: false
});
var serverDB = new JsonDB(new Config(global.appRoot + "/db/serverDB",true,true,'/'));
serverDB.load();

// Listen Events
global.client
  .on('error',console.error)
  .on('warn',console.warn)
  .on('debug',console.log)
  .on('ready', () => {
    global.client.user.setActivity(`for commands (@${global.client.user.tag} help)`, { type: 'WATCHING' })
      .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
      .catch(console.error);
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    console.log('          DSABOT')
    console.log('           v0.7')
    console.log('~~~developed by ggtylerr~~~')
    console.log('If you have issues, please ')
    console.log(' go to the support server!')
    console.log('    discord.gg/N5HnVrA')
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    console.log(`Logged in as @${global.client.user.tag}!`);
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~')
  })
  .on('disconnect', () => console.log('Disconnected and will no longer attempt to reconnect.'))
  .on('reconnecting', () => console.log('Attempting to reconnect...'))
  .on('resume', replays => console.log('WebSocket resumed (we\'re back online.) ' + replays + ' events have been replayed.'))
  .on('commandError', (cmd,err) => {
    if (err instanceof Commando.FriendlyError) return;
    console.error(`Error occured in command ${cmd.groupID}:${cmd.memberName}`,err);
  })
  .on('message', message => {
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
global.client.setProvider(
	sqlite.open(path.join(__dirname, 'db/commando.sqlite3')).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);
// Register Commands
global.client.registry
  .registerDefaultTypes()
  .registerTypesIn(path.join(__dirname,'types'))
  .registerGroups([
    ['gen','General Commands'],
    ['esprt','eSports Commands'],
    ['meme','Meme Commands'],
    ['cvd19','COVID-19 Commands'],
    ['admin','Admin Commands'],
    ['nopre','No Prefix Commands']
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({help:false,eval:false})
  .registerCommandsIn(path.join(__dirname,'cmds'));
// Login
global.client.login(process.env.token);