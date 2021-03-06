/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Disconnect / Leaving command. Simple command that disconnects the bot.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');

const JsonDB = require('node-json-db').JsonDB;
const DBConfig = require('node-json-db/dist/lib/JsonDBConfig').Config;

var musicDB = new JsonDB(new DBConfig(process.env.appRoot + "/db/musicDB",false,true,'/'));

module.exports = class PlayCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'leave',
      aliases: ['disconnect', 'dc', 'end', 'stop'],
      group: 'music',
      memberName: 'leave',
      guildOnly: true,
      description: 'Leaves the current VC'
    });
  }
  async run(message) {
    // Get VC and check if the bot is actually on one
    var vc = message.guild.me.voice.channel;
    if (!vc) return message.reply("I can't leave a VC that I'm not in...");
    const id = message.guild.id;
    // Leave VC
    vc.leave();
    // Stop dispatcher (if it exists)
    if (!(typeof vc.dispatcher == 'undefined' || vc.dispatcher == null))
      vc.dispatcher.end("0"); // dont clear queue
    // Set to stop playing
    try {
      await musicDB.reload();
      musicDB.push(`/${id}/isPlaying`,false);
      musicDB.save();
    } catch (e) {
      // ???
      console.error(e);
      return message.channel.send(`The bot left the channel, but an error occurred while getting/pushing to DB! You shouldn't have to see this. Please contact the devs or bot owner about this, along with this log:\n\`\`\`${e}\`\`\``);
    }
    // Profit!
    message.reply("Left VC!");
  }
}
