/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Remove command. Simple command that removes a song from the queue.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');

const JsonDB = require('node-json-db').JsonDB;
const DBConfig = require('node-json-db/dist/lib/JsonDBConfig').Config;

var musicDB = new JsonDB(new DBConfig(process.env.appRoot + "/db/musicDB",false,true,'/'));

module.exports = class RemoveCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'remove',
      aliases: ['rm'],
      group: 'music',
      memberName: 'remove',
      guildOnly: true,
      description: 'Removes that song from the queue.',
      args: [
        {
          key: 'song',
          prompt: 'What song do you want to remove? (Reply with # in queue)',
          type: 'integer'
        }
      ]
    });
  }
  async run(message, {song}) {
    // Get ID and VC
    const vc = message.guild.me.voice.channel;
    const id = message.guild.id;
    // Get queue data
    var q = "";
    try {
      await musicDB.reload();
      q = musicDB.getData(`/${id}/queue`);
    } catch (e) {
      console.error(e);
      return message.channel.send(`Error ocurred while trying to get queue data! You shouldn't have to see this. Please contact the devs or bot owner about this, along with this log:\n\`\`\`${e}\`\`\``);
    }
    // Check if position is valid
    if (song <= 0 || song > q.length) {
      return message.channel.send("Incorrect position!");
    }
    // Check if user either has permission or is the person who requested it
    if (message.author.id !== q[song-1].user && !(message.guild.member(message.author).hasPermission('PRIORITY_SPEAKER'))) {
      return message.channel.send("You didn't request the songs inbetween, and you don't have the perms (Priority Speaker) to skip it!");
    }
    // Remove song
    q.splice(song-1,1);
    // If the song is the 1st song, and there's a song playing, 
    // add an empty value at the start.
    // This is because we'll treat it as a skip, and to do that we'll end
    // the dispatcher, which automatically skips the song playing.
    if (song == 1 && vc) {
      if (!(typeof vc.dispatcher == 'undefined' || vc.dispatcher == null)) {
        q.unshift({});
      }
    }
    // Save queue to db
    try {
      musicDB.push(`/${id}/isPlaying`,true);
      musicDB.save();
    } catch (e) {
      console.error(e);
      return message.channel.send(`Error ocurred while trying to save queue data! You shouldn't have to see this. Please contact the devs or bot owner about this, along with this log:\n\`\`\`${e}\`\`\``);
    }
    // Stop dispatcher (if it exists and the song is the 1st song)
    if (song == 1 && vc) {
      if (!(typeof vc.dispatcher == 'undefined' || vc.dispatcher == null)) {
        vc.dispatcher.end();
      }
    }
    // Profit!
    message.reply("Removed that song!");
  }
}