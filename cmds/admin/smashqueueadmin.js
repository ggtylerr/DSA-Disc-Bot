/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * smash.gg queue admin only setting command. Utilizes node-json-db to set whether queues should only be done by admins.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');

const JsonDB = require('node-json-db').JsonDB;
const Config = require('node-json-db/dist/lib/JsonDBConfig').Config;

var serverDB = new JsonDB(new Config(process.env.appRoot + "/db/serverDB",false,true,'/'));

module.exports = class SmashGGQueueAdminCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'smashqueueadmin',
      aliases: ['squeueadmin','sqa'],
      group: 'sggqu',
      memberName: 'smashqueueadmin',
      description: 'Queues up a tournament or league to be ready for commands.',
      userPermissions: ['ADMINISTRATOR'],
      guildOnly: true,
      args: [
        {
          key: 'bool',
          prompt: 'What tournament do you want?\n(Paste in the end of the URL like so: silver-state-smash-3)',
          type: 'boolean',
          default: 'toggle'
        }
      ]
    });
  }
  async run(message, {bool}) {
    // Load database
    serverDB.load();
    var id = message.channel.guild.id;
    // If it's the default toggle, get the opposite of the current value.
    if (bool == 'toggle') {
      try {
        bool = serverDB.getData(`/${id}/smashqueueadmin`);
        bool = !bool;
      } catch (e) {
        bool = true;
      }
    }
    // Push and save
    serverDB.push(`/${id}/smashqueueadmin`,bool);
    serverDB.save();
    // Send confirmation message
    if (bool) {
      message.channel.send('Set queues to only be configurable by admins.');
    } else {
      message.channel.send('Set queues to be configurable by everyone.');
    }
  }
}
