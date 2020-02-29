/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * DSA Bot
 * 
 * A Discord bot made for the DSA Esports server.
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
const JsonDB = require('node-json-db').JsonDB;
const Config = require('node-json-db/dist/lib/JsonDBConfig').Config;

// Important Variables
const client = new Discord.Client();
var serverDB = new JsonDB(new Config(global.appRoot + "/db/serverDB",false,true,'/'));
serverDB.load();
const defprefix = ';' // Default prefix, configure if needed
let prefix = defprefix;
var logDBSaves = false; // If true, logs whenever the database is saved (Auto-saves every minute)

// Saving database (every minute)
function dbSave() {
  serverDB.save();
  if (logDBSaves) console.log('Database successfully saved.');
}
setInterval(dbSave, 60*1000);

// Listen Events
client.on('message', fulmsg => {
  // Vars
  let msg = fulmsg.content;
  let sender = fulmsg.author;
  let args = msg.slice(prefix.length).trim().split(' ');
  let cmd = args.shift().toLowerCase();
  
  // Return if DMs
  if (fulmsg.channel.guild === undefined || fulmsg.channel.guild === null) return;

  // Prefix Command
  var id = fulmsg.channel.guild.id;
  if (id === null) prefix = defprefix;
  try {
    prefix = serverDB.getData(`/${id}/prefix`);
  } catch (e) {
    prefix = defprefix;
  }

  // Help command arguments
  // (This is done because the help command needs the prefix, and obviously we don't want to pass the prefix around to every single command)
  if (cmd === 'help' || cmd === 'sayhelp') args.push(prefix);

  // Return if bot
  if (fulmsg.author.bot) return;

  // Message count updating
  if (id !== null) {
    try {
      var countData = serverDB.getData(`/${id}/count`) + 1;
      serverDB.push(`/${id}/count`,countData);
    } catch {
      serverDB.push(`/${id}/count`,1);
    }
  }

  // Non prefix commands
  let noprefix = require('./noprefix.js');
  noprefix.run(client,fulmsg,args);

  // Return if non prefix from here
  if (!msg.startsWith(prefix)) return;

  // Command Handler
  try {
    let commandFile = require(`./cmds/${cmd}.js`);
    commandFile.run(client,fulmsg,args);
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
      console.log(e.stack);
      fulmsg.channel.send('An error occurred while attempting to run that command. Printing stack trace...')
      fulmsg.channel.send('```' + e.stack + '```');
    }
  } finally {
    console.log(`${fulmsg.author.tag} ran command ${cmd} on ${(new Date()).toJSON().slice(0, 19).replace(/[-T]/g, ':')}`)
  }
});

// Ready up event
client.on('ready', () => {
  client.user.setActivity('for commands (Ping for help)', { type: 'WATCHING' })
    .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
    .catch(console.error);
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~')
  console.log('          DSABOT')
  console.log('           v0.3')
  console.log('~~~developed by ggtylerr~~~')
  console.log('Please note that console lists all *attempted* commands, including non existant ones.')
  console.log('Also, due to various issues out of our hands, this bot may attempt to end its own life. We highly suggest you either make it automatically restart or you continuously monitor it via console, UptimeRobot, or other means.')
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~')
  console.log(`Logged in as ${client.user.tag}!`);
});

// Login
client.login(process.env.token);