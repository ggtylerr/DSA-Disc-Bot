/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Queue command. Utilizes node-json-db to handle queue and PaginationEmbed for showing queues better
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');

const { MessageEmbed } = require('discord.js');

const JsonDB = require('node-json-db').JsonDB;
const DBConfig = require('node-json-db/dist/lib/JsonDBConfig').Config;

var musicDB = new JsonDB(new DBConfig(process.env.appRoot + "/db/musicDB",false,true,'/'));

const Pagination = require('discord-paginationembed');

module.exports = class QueueCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'queue',
      aliases: ['q'],
      group: 'music',
      memberName: 'queue',
      guildOnly: true,
      description: 'View the list of songs/videos up next'
    });
  }
  async run(message) {
    // Get VC and check if the bot is actually on one
    var vc = message.guild.me.voice.channel;
    if (!vc) return message.reply("I'm not in a VC on this server.");
    // Get queue
    var q = {};
    try {
      await musicDB.reload();
      q = musicDB.getData(`/${vc.id}`);
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
    // Make loading message
    var load = await message.channel.send("Loading... *(Making results...)*");
    // Make embeds
    const embeds = [];
    for (let i = 0; i < q.queue.length; i += 9) {
      const embed = new MessageEmbed()
        .setFooter(`Page ${Math.floor(i/9)+1}/${Math.floor(q.queue.length/9)+1}`);
      var c = i;
      for (let j = i; j < Math.min(i+9,q.queue.length); j++) {
        c++;
        embed.addField(`${c}. ${q.queue[j].title}`,`URL: ${q.queue[j].url}`,true);
      }
      embeds.push(embed);
    }
    // Compile and build pagination embed
    new Pagination.Embeds()
      .setArray(embeds)
      .setChannel(message.channel)
      .setColor('#e52d27')
      .setTitle('Current queue in VC')
    .build();
    load.delete();
  }
}
