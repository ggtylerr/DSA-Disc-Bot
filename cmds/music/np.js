/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Now playing command. Utilizes node-json-db to get the queue data and the simple-youtube-api to get video data
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');

const { MessageEmbed } = require('discord.js');

const JsonDB = require('node-json-db').JsonDB;
const DBConfig = require('node-json-db/dist/lib/JsonDBConfig').Config;

var musicDB = new JsonDB(new DBConfig(process.env.appRoot + "/db/musicDB",false,true,'/'));

const Moment = require('moment');
const YouTube = require('simple-youtube-api');
const yt = new YouTube(process.env.ytapi);

module.exports = class NowPlayingCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'nowplaying',
      aliases: ['np'],
      group: 'music',
      memberName: 'nowplaying',
      guildOnly: true,
      description: 'View the list of songs/videos up next'
    });
  }
  async run(message) {
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
    // Make embed
    const s = q.queue[0];
    const v = await yt.getVideo(`${s.url}`);
    const vs = await yt.getVideoByID(v.id, {part: 'statistics'});
    const cs = await yt.getChannelByID(v.channel.id, {part: 'statistics'});
    const embed = new MessageEmbed()
      .setColor('#e52d27')
      .setTitle('Currently playing song in the server')
      .setDescription(`**[${s.title}](${s.url})**
      ${full(vc.dispatcher.streamTime/1000)} / ${full(s.duration)}`)
      .setThumbnail(v.thumbnails.default.url)
      .addField('YT Info',`By [${v.channel.title}](https://www.youtube.com/channel/${v.channel.id}) - ${cs.subscriberCount} subs
      :thumbsup: ${vs.raw.statistics.likeCount} • :thumbsdown: ${vs.raw.statistics.dislikeCount} • ${vs.raw.statistics.viewCount} views • [${Moment(v.publishedAt).format("MMM Do, YYYY, h:mm:ss a [UTC]")}](https://www.timeanddate.com/worldclock/converter.html?iso=${Moment(v.publishedAt).format("YYYYMMDD[T]HHmmss")}&p1=1440&p2=tz_pt&p3=tz_et&p4=tz_eet&p5=tz_jst)`)
      .addField('Description',(v.description.length > 300) ? `${v.description.substring(0,300)}...` : v.description);
    message.channel.send(embed);
  }
}

function full(a) {
  if (a === -1) {
    return "???";
  }
  var h = Math.floor(a / 3600);
  var m = Math.floor(a % 3600 / 60);
  var s = Math.floor(a % 3600 % 60);
  h = (h < 10) ? "0" + h : h;
  m = (m < 10) ? "0" + m : m;
  s = (s < 10) ? "0" + s : s;
  return `${h}:${m}:${s}`;
}