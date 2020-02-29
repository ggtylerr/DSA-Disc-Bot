/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Cough timeout command. Utilizes quick.db to have server-specific cough timeouts.
 * 
 * ~~~developed by ggtylerr~~~
 */

var path = require('path');

const JsonDB = require('node-json-db').JsonDB;
const Config = require('node-json-db/dist/lib/JsonDBConfig').Config;

var serverDB = new JsonDB(new Config(global.appRoot + "/db/serverDB",true,true,'/'));

exports.run = (client, message, args) => {
  serverDB.load();

  if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You must have admin privileges to do that.');
  if (isNaN(args[0])) return message.channel.send('Argument needs to be a number.');

  var id = message.channel.guild.id;

  if (id === null) return;
  if (parseInt[args[0]] < 0) {
    serverDB.delete(`/${id}/coughtimeout`);
  } else {
    serverDB.push(`/${id}/coughtimeout/curr`,0);
    serverDB.push(`/${id}/coughtimeout/set`,parseInt(args[0]))
    serverDB.push(`/${id}/coughtimeout/time`,0);
  }

  message.channel.send('Timeout updated!');
  
}