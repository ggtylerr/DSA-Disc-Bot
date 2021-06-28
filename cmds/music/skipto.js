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

module.exports = class SkipToCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'skipto',
      aliases: ['sto'],
      group: 'music',
      memberName: 'skipto',
      guildOnly: true,
      description: 'Skips to that position in the queue.',
      args: [
        {
          key: 'pos',
          prompt: 'What song do you want to skip to? (Reply with # in queue)',
          type: 'integer'
        }
      ]
    });
  }
  async run(message, {pos}) {
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
    // Check if position is valid
    if (pos <= 0 || pos > q.length) {
      return message.channel.send("Incorrect position!");
    }
    // Check if user either has permission or is the person who requested it
    let reqchk = false;
    for (var i = 0; i < pos; i++) {
      if (message.author.id !== q[i].user) {
        reqchk = true;
        break;
      }
    }
    if (reqchk && !(message.guild.member(message.author).hasPermission('PRIORITY_SPEAKER'))) {
      return message.channel.send("You didn't request the preceding songs, and you don't have the perms (Priority Speaker) to skip it!");
    }
    // Remove songs from queue except the last one before the requested one
    // This is because the dispatcher shifts automatically when ending
    q.splice(0, pos-2);
    try {
      musicDB.push(`/${id}/isPlaying`,true);
      musicDB.save();
    } catch (e) {
      console.error(e);
      return message.channel.send(`Error ocurred while trying to save queue data! You shouldn't have to see this. Please contact the devs or bot owner about this, along with this log:\n\`\`\`${e}\`\`\``);
    }
    // Stop dispatcher (if it exists)
    if (vc) {
      if (!(typeof vc.dispatcher == 'undefined' || vc.dispatcher == null)) {
        vc.dispatcher.end();
      }
    }
    // Profit!
    message.reply("Skipped to that song!");
  }
}