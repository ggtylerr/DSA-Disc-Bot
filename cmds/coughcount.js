/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Cough count command. Utilizes node-json-db to have server-specific cough counts.
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
    count = serverDB.getData(`/${id}/coughcount`);
    message.channel.send(count);
  } catch (e) {
    message.channel.send('0');
  }
}