/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Message count command. Utilizes mode-json-db to have server-specific message counts.
 * 
 * ~~~developed by ggtylerr~~~
 */

var path = require('path');

const JsonDB = require('node-json-db').JsonDB;
const Config = require('node-json-db/dist/lib/JsonDBConfig').Config;

var serverDB = new JsonDB(new Config(global.appRoot + "/db/serverDB",false,true,'/'));
serverDB.load();

exports.run = (client, message, args) => {
  var id = message.channel.guild.id;

  if (id === null) return;
  try {
    var count = serverDB.getData(`/${id}/count`);
    message.channel.send(count)
  } catch (e) {
    message.channel.send('Couldn\'t get the count from our database. This probably only happens if nobody has said anything since the bot joined (excluding other bots.) Since you said something, just wait around a minute before it automatically updates.\n*(If you believe this is a bug, please DM @\\\\\\\\GGTyler\\\\\\\\#8605*)');
  }
}