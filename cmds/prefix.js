/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Setting prefix command. Utilizes node-json-db to set a server-specific prefix. Requires having the 'administrator' permission to use the command.
 * 
 * ~~~developed by ggtylerr~~~
 */

var path = require('path');

const JsonDB = require('node-json-db').JsonDB;
const Config = require('node-json-db/dist/lib/JsonDBConfig').Config;

var serverDB = new JsonDB(new Config(global.appRoot + "/db/serverDB",true,true,'/'));
serverDB.load();

exports.run = (client, message, args) => {
  if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You must have admin privileges to do that.');

  serverDB.push(`/${message.channel.guild.id}/prefix`, args.join(' '));
  message.channel.send('Updated!');
}