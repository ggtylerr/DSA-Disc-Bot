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
    // Make loading message
    var load = await message.channel.send("Loading... *(Making results...)*");
    // Make embeds
    const embeds = [];
    var d = 0;
    for (let i = 0; i < q.queue.length; i += 9) {
      const embed = new MessageEmbed()
        .setFooter(`Page ${Math.floor(i/9)+1}/${Math.floor(q.queue.length/9)+1}`);
      var c = i;
      for (let j = i; j < Math.min(i+9,q.queue.length); j++) {
        const u = await this.client.users.fetch(q.queue[j].user);
        c++;
        embed.addField(`${c}. ${q.queue[j].title}`,`URL: ${q.queue[j].url}\nDuration: ${full(q.queue[j].duration)}\nTime till this plays: ${full(d)}\nRequested by: ${u.tag.replace(/\\/g,"\\\\")}`,true);
        d += q.queue[j].duration;
      }
      embeds.push(embed);
    }
    // Compile and build pagination embed
    new Pagination.Embeds()
      .setArray(embeds)
      .setChannel(message.channel)
      .setColor('#e52d27')
      .setTitle('Current queue in server')
    .build();
    load.delete();
  }
}

function full(a) {
  var h = Math.floor(a / 3600);
  var m = Math.floor(a % 3600 / 60);
  var s = Math.floor(a % 3600 % 60);
  h = (h < 10) ? "0" + h : h;
  m = (m < 10) ? "0" + m : m;
  s = (s < 10) ? "0" + s : s;
  return `${h}:${m}:${s}`;
}