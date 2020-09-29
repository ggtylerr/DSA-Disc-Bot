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
const QT = require('../../util/smash/queuetypes');

var channelDB = new JsonDB(new Config(process.env.appRoot + "/db/channelDB",false,true,'/'));

module.exports = class SmashGGQueueCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'smashggqueueview',
      aliases: ['squeueview','sqv'],
      group: 'sggqu',
      memberName: 'smashggqueueview',
      description: 'Shows the current queued item.'
    });
  }
  async run(message, {slug}) {
    // Load databases
    await channelDB.reload();
    // Get queued item
    var id = message.channel.id;
    var q = null;
    try {
      q = channelDB.getData(`/${id}/sq`);
    } catch (e) {
      return message.channel.send("There is nothing in the queue.");
    }
    // Print queued item
    message.channel.send(`Currently in queue: ${q.name} [Type: ${QT[q.type]}, Link: ${q.link}]`);
  }
}
