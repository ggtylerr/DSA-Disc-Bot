/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Cough timeout command. Utilizes quick.db to have server-specific cough timeouts.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');

const JsonDB = require('node-json-db').JsonDB;
const Config = require('node-json-db/dist/lib/JsonDBConfig').Config;

var serverDB = new JsonDB(new Config(process.env.appRoot + "/db/serverDB",false,true,'/'));
var channelDB = new JsonDB(new Config(process.env.appRoot + "/db/channelDB",false,true,'/'));

module.exports = class CoughTimeoutCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'smashqueue',
      group: 'sggqu',
      memberName: 'smashqueue',
      description: 'Queues up a tournament or league to be ready for commands.',
      details: 'Can be set to admin only using the command (not implemented yet)',
      examples: ['smashqueue silver-state-smash-3'],
      args: [
        {
          key: 'slug',
          prompt: 'What tournament do you want?\n(Paste in the end of the URL like so: silver-state-smash-3)',
          type: 'string'
        }
      ]
    });
  }
  async run(message, {slug}) {
    // Load databases
    serverDB.load();
    channelDB.load();
    // Check if the command should only be run by admins
    var adminOnly = false;
    var id = message.channel.guild.id;
    // TODO: Implement admin only functionality and command.
    if (adminOnly && !message.member.hasPermission('ADMINISTRATOR')) {
      return message.reply('This command can only be used by people have who admin perms!');
    }
    // TODO: Idiot proof links
    // Push to channel database
    var cid = message.channel.id;
    channelDB.push(`/${cid}/sq/link`,slug);
    channelDB.push(`/${cid}/sq/type`,null);
    channelDB.save();
    message.channel.send(`Queue updated! New queued tourney: ${slug}`);
  }
}
