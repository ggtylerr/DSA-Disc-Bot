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

module.exports = class ClearCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'clear',
      aliases: ['cl'],
      group: 'music',
      memberName: 'clear',
      guildOnly: true,
      description: 'Clears the queue.',
      userPermissions: ['PRIORITY_SPEAKER']
    });
  }
  async run(message) {
    // Get ID and VC
    const vc = message.guild.me.voice.channel;
    const id = message.guild.id;
    // Stop dispatcher (if it exists)
    if (vc)
      if (!(typeof vc.dispatcher == 'undefined' || vc.dispatcher == null))
        vc.dispatcher.pause();
    // Clear queue
    try {
      await musicDB.reload();
      musicDB.push(`/${id}/queue`,[]);
      musicDB.push(`/${id}/isPlaying`,false);
      musicDB.save();
    } catch (e) {
      // ???
      console.error(e);
      return message.channel.send(`The bot left the channel, but an error occurred while getting/pushing to DB! You shouldn't have to see this. Please contact the devs or bot owner about this, along with this log:\n\`\`\`${e}\`\`\``);
    }
    // Profit!
    message.reply("Cleared the queue!");
  }
}