/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Volume command. Simple command that changes the volume in a Stream Dispatcher.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');

const JsonDB = require('node-json-db').JsonDB;
const DBConfig = require('node-json-db/dist/lib/JsonDBConfig').Config;

var musicDB = new JsonDB(new DBConfig(process.env.appRoot + "/db/musicDB",false,true,'/'));

module.exports = class VolumeCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'volume',
      aliases: ['v'],
      group: 'music',
      memberName: 'volume',
      guildOnly: true,
      description: 'Changes the volume',
      args: [
        {
          key: 'volume',
          prompt: 'What do you want to change the volume to?',
          type: 'volume'
        }
      ]

    });
  }
  async run(message,{volume}) {
    // Get VC
    var vc = message.guild.me.voice.channel;
    if (!vc) return message.reply("I'm not in a VC.");
    if (typeof vc.dispatcher == 'undefined' || vc.dispatcher == null) return message.reply("Nothing is playing.");
    // Get ID
    const id = message.guild.id;
    // Get queue
    var q = {};
    try {
      await musicDB.reload();
      q = musicDB.getData(`/${id}`);
    } catch (e) {
      if (e.constructor.name == "DataError") {
        return message.reply("Queue is empty.");
      } else {
        console.error(e);
        return message.channel.send(`Error occurred while getting DB! You shouldn't have to see this. Please contact the devs or bot owner about this, along with this log:\n\`\`\`${e}\`\`\``);
      }
    }
    // Check if queue is empty
    if (q.queue.length == 0)
      return message.reply("Queue is empty.");
    // Change volume
    vc.dispatcher.setVolume(volume);
    // State change
    const vs = (volume * 100) + "%"
    return message.reply(`Changed volume to ${vs}!`);
  }
}
