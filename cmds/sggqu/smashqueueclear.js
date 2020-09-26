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
    await channelDB.reload();
    // Delete queue
    var id = message.channel.id;
    await channelDB.delete(`/${id}/sq`);
    channelDB.save();
    // Print queued item
    message.channel.send('Cleared the queue.');
  }
}
