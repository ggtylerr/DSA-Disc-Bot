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
const Discord = require('discord.js');
const db = require('quick.db');

// Important Variables
const client = new Discord.Client();
const defprefix = ';' // Default prefix, configure if needed
let prefix = defprefix;
var logMsgUpdates = true; // If true, logs whenever the message count is updated(Auto-saves every minute)

// Grabbing Message Count
let count = [];
var allDb = db.all();
for (var i = 0; i < Object.keys(allDb).length; i++) {
  var curr = allDb[i];
  if (curr.ID.startsWith('count_')) {
    curr.ID = curr.ID.substr(6);
    count.push(allDb[i]);
  }
}

// Setting Message Count
function setCount() {
  for (var i = 0; i < Object.keys(count).length; i++) {
    if (count[i].data.constructor === String) {
      count[i].data.replace(/[^0-9]/g,'');
      count[i].data = parseInt(count[i].data);
    }
    db.set(`count_${count[i].ID}`, count[i].data);
  }
  if (logMsgUpdates) console.log('Message count updated.');
}
setInterval(setCount, 60*1000);

// Time out coughs
var coughTimeOut = 0;
function coughReset() {
  coughTimeOut = 0;
  console.log('Cough reset');
}
setInterval(coughReset,60*1000);

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
  else prefix = db.fetch(`prefix_${id}`);
  if (prefix === null) prefix = defprefix;

  // Help command arguments
  // (This is done because the help command needs the prefix, and obviously we don't want to pass the prefix around to every single command)
  if (cmd === 'help' || cmd === 'sayhelp') args.push(prefix);

  // Return if bot
  if (fulmsg.author.bot) return;

  // Message count updating
  if (id !== null) {
    var i = 0;
    var c = 0;
    for (; i < Object.keys(count).length; i++) {
      if (count[i].ID === id) {
        c = count[i].data;
        if (c.constructor === String) {
          c.replace(/[^0-9]/g,'');
          c = parseInt(c);
        }
        delete count[i];
        break;
      }
    }
    count[i] = {
      ID    : id,
      data  : c + 1
    }
  }

  // Non prefix commands
  if (msg.toLowerCase() === 'ayy') fulmsg.channel.send('lmao');
  if (msg.toLowerCase() === 'owo') fulmsg.channel.send('What\'s this?');
  if (msg.toLowerCase() === 'cough') {
    coughTimeOut += 1;
    if (coughTimeOut == 10) {
      fulmsg.channel.send('Too many coughs. Please wait about a minute.')
      return;
    }
    else if (coughTimeOut > 10) return;
    console.log(fulmsg.author.tag + ' coughed');
    fulmsg.channel.send('Cough');
    count = db.fetch(`cough_${id}`);
    if (count === null) count = 2
    else count += 2
    db.set(`cough_${id}`,count);
    console.log('Cough set');
  }
  if (msg.toLowerCase() === 'me2' || msg.toLowerCase() === 'me to' || msg.toLowerCase() === 'me too') fulmsg.channel.send('me too');
  if (msg.toLowerCase() === 'twitch.tv/ggtylerr') fulmsg.channel.send('two r\'s all lowercase')
  if (msg.toLowerCase() === 'go the marcus' || msg.toLowerCase() === 'go da marcus') fulmsg.channel.send('go da marcus')
  if (msg.toLowerCase() === '<@!675555531901108296> help' || msg.toLowerCase() === '<@!675555531901108296>') {
    let help = require('./cmds/help.js');
    help.run(client,fulmsg,args);
  }

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
  client.user.setActivity('for commands (Ping for cmds)', { type: 'WATCHING' })
    .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
    .catch(console.error);
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~')
  console.log('          DSABOT')
  console.log('           v0.2')
  console.log('~~~developed by ggtylerr~~~')
  console.log('Please note that console lists all *attempted* commands, including non existant ones.')
  console.log('Also, due to various issues out of our hands, this bot may attempt to end its own life. We highly suggest you either make it automatically restart or you continuously monitor it via console, UptimeRobot, or other means.')
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~')
  console.log(`Logged in as ${client.user.tag}!`);
});

// Login
client.login(process.env.token);