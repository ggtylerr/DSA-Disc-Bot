/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Opt-Out DM command. Opts out of any DMs sent from the bot in a server.
 * 
 * (Note: This command necessary if you want to use any commands involving user sending DMs, as it is required by top.gg and a number of other bot list sites.)
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');

const JsonDB = require('node-json-db').JsonDB;
const Config = require('node-json-db/dist/lib/JsonDBConfig').Config;

var serverDB = new JsonDB(new Config(process.env.appRoot + "/db/serverDB",false,true,'/'));

module.exports = class CountCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'optoutdm',
      aliases: ['nodm','blockdm'],
      group: 'gen',
      memberName: 'optoutdm',
      description: 'Opt-outs of any DMs sent by this bot. Server specific.',
      details: 'Run the command again to opt back in.',
      guildOnly: true
    });
  }
  async run(message) {
    var id = message.channel.guild.id;
    var user = message.author.id;
    if (id === null || user === null) return;
    await serverDB.reload();
    try {
      var dmArr = serverDB.getData(`/${id}/optoutdm`);
      var i = dmArr.indexOf(user);
      if (i === -1) {
        dmArr.push(user);
        message.channel.send("Opted out of all DMs from this server!");
      } else {
        dmArr.splice(i, 1);
        message.channel.send("Opted in to all DMs from this server!");
        console.log(dmArr);
      }
      serverDB.push(`/${id}/optoutdm`,dmArr);
    } catch (e) {
      var dmArr = [user];
      serverDB.push(`/${id}/optoutdm`,dmArr);
      message.channel.send("Opted out of all DMs from this server!");
    }
    serverDB.save();
  }
}
