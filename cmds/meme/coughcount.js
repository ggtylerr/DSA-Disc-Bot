/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Cough count command. Utilizes quick.db to have server-specific cough counts.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');

const JsonDB = require('node-json-db').JsonDB;
const Config = require('node-json-db/dist/lib/JsonDBConfig').Config;

var path = require('path');
var root = path.resolve(__dirname).split("/cmds/")[0];

var serverDB = new JsonDB(new Config(root + "/db/serverDB",false,true,'/'));

module.exports = class CoughCountCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'coughcount',
      aliases: ['coughs'],
      group: 'meme',
      memberName: 'coughcount',
      description: '# of coughs in the server (including coughs by this bot)',
      details: 'Count is server-specific. Includes the cough response by this bot. Other bots do not count.',
      guildOnly: true,
    });
  }
  async run(message) {
    var id = message.channel.guild.id;
    if (id === null) return;
    try {
      // Reinitiate database so it properly loads
      await serverDB.reload();
      message.channel.send(serverDB.getData(`/${id}/coughcount`));
    } catch (e) {
      message.channel.send('0');
    }
  }
}
