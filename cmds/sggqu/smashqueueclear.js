/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * smash.gg view queue command. Utilizes node-json-db to view channel specific queues.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');

const JsonDB = require('node-json-db').JsonDB;
const Config = require('node-json-db/dist/lib/JsonDBConfig').Config;

var serverDB = new JsonDB(new Config(process.env.appRoot + "/db/serverDB",false,true,'/'));
var channelDB = new JsonDB(new Config(process.env.appRoot + "/db/channelDB",false,true,'/'));

module.exports = class SmashGGQueueCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'smashqueueclear',
      aliases: ['squeueclear','sqc'],
      group: 'sggqu',
      memberName: 'smashqueueclear',
      description: 'Clears the current queued item.'
    });
  }
  async run(message, {slug}) {
    // Load databases
    await serverDB.reload();
    await channelDB.reload();
    // Check if the command should only be run by admins
    var id = message.channel.guild.id;
    var dbd8a = false;
    try {
      dbd8a = serverDB.getData(`/${id}/smashqueueadmin`);
    } catch (e) {
      // Not set as admin only, ignore.
    }
    if (dbd8a && !message.member.hasPermission('ADMINISTRATOR')) {
      return message.reply('This command can only be used by people have who admin perms!');
    }
    // Delete queue
    var id = message.channel.id;
    await channelDB.delete(`/${id}/sq`);
    channelDB.save();
    // Print queued item
    message.channel.send('Cleared the queue.');
  }
}
