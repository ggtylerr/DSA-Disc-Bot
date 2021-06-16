/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Clear queue command. Simple command that clears the current queue in the DB.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');

const JsonDB = require('node-json-db').JsonDB;
const DBConfig = require('node-json-db/dist/lib/JsonDBConfig').Config;

var musicDB = new JsonDB(new DBConfig(process.env.appRoot + "/db/musicDB",false,true,'/'));

module.exports = class SkipCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'skip',
      aliases: ['s'],
      group: 'music',
      memberName: 'skip',
      guildOnly: true,
      description: 'Skips the currently playing song.'
    });
  }
  async run(message) {
    // Get ID and VC
    const vc = message.guild.me.voice.channel;
    const id = message.guild.id;
    // Get queue data (for the song requester)
    var q = "";
    try {
      await musicDB.reload();
      q = musicDB.getData(`/${id}/queue`);
    } catch (e) {
      console.error(e);
      return message.channel.send(`Error ocurred while trying to get queue data! You shouldn't have to see this. Please contact the devs or bot owner about this, along with this log:\n\`\`\`${e}\`\`\``);
    }
    // Check if user either has permission or is the person who requested it
    if (message.author.id !== q[0].id && !(message.guild.member(message.author).hasPermission('PRIORITY_SPEAKER')))
      return message.channel.send("You didn't request this song, and you don't have the perms (Priority Speaker) to skip it!");
    // Stop dispatcher (if it exists)
    if (vc)
      if (!(typeof vc.dispatcher == 'undefined' || vc.dispatcher == null))
        vc.dispatcher.end();
    // Profit!
    message.reply("Skipped song!");
  }
}