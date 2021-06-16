/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Music playing command, using the YouTube Data API for gathering info on videos and searching for them, YTDL for playing videos on voice channels, and node-json-db for queues. 
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');

const { MessageEmbed } = require('discord.js');

const Moment = require('moment');
const Pagination = require('discord-paginationembed');

const YouTube = require('simple-youtube-api');
const yt = new YouTube(process.env.ytapi);

const JsonDB = require('node-json-db').JsonDB;
const DBConfig = require('node-json-db/dist/lib/JsonDBConfig').Config;

const {playSong} = require('../../util/music');
const Config = require('../../config');

var musicDB = new JsonDB(new DBConfig(process.env.appRoot + "/db/musicDB",false,true,'/'));
var serverDB = new JsonDB(new DBConfig(process.env.appRoot + "/db/serverDB",false,true,'/'));

module.exports = class PlayCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'play',
      aliases: ['p'],
      group: 'music',
      memberName: 'play',
      description: 'Play anything available on YouTube',
      guildOnly: true,
      clientPermissions: ['SPEAK','CONNECT'],
      args: [
        {
          key: 'query',
          prompt: 'What song/video do you want to listen to?',
          type: 'string'
        }
      ]
    });
  }
  async run(message, {query}) {
    // Grab VC and make sure user is in it
    const vc = message.member.voice.channel;
    if (!vc) return message.channel.send("You aren't in a VC! Join one, then retry the command.");
    if (vc !== message.guild.me.voice.channel && (message.guild.me.voice.channel)) return message.channel.send("You aren't in the same VC I'm in! Join the one I'm in or do `join` to make me join the one you're at.");
    const id = message.guild.id;
    // Get database info
    var db = {
      queue: [],
      isPlaying: false
    }
    try {
      await musicDB.reload();
      db = musicDB.getData(`/${id}`);
    } catch (e) {
      if (e.constructor.name == "DataError") {
        musicDB.push(`/${id}`,db);
      } else {
        console.error(e);
        return message.channel.send(`Error occurred while getting DB! You shouldn't have to see this. Please contact the devs or bot owner about this, along with this log:\n\`\`\`${e}\`\`\``);
      }
    }
    // Get settings
    var settings = {
      stream: Config.YTNoStreams,
      duration: Config.YTDuration,
      quality: Config.YTQuality,
      limit: Config.MQueueLimit
    }
    try {
      await serverDB.reload();
      const a = serverDB.getData(`/${id}/settings`);
      if (!(a.YTNoStreams == null)) settings.stream = a.YTNoStreams;
      if (!(a.YTDuration == null)) settings.duration = a.YTDuration;
      if (!(a.YTQuality == null)) settings.quality = a.YTQuality;
      if (!(a.MQueueLimit == null)) settings.limit = a.MQueueLimit;
    } catch (e) {
      if (e.constructor.name == "DataError") {
        // Server has no settings, ignore and move on.
      } else {
        console.error(e);
        return message.channel.send(`Error occurred while getting DB! You shouldn't have to see this. Please contact the devs or bot owner about this, along with this log:\n\`\`\`${e}\`\`\``);
      }
    }
    // Check for queue limit
    if (settings.limit != -1 && db.queue.length > settings.limit)
      return message.channel.send('Queue limit reached! Either wait a bit or remove some songs.');
    // Get video from query
    var vid;
    var pl = true;
    // Playlist URLs
    if (query.match(/^(http(s)?:\/\/)?((w){3}.)?youtube.com\/playlist\?list=.+/)) {
      try {
        // Get playlist and videos
        var playlist = await yt.getPlaylist(query);
        var videos = await playlist.getVideos();
        // Create playlist object for reference
        pl = {
          t: playlist.title,
          l: videos.length,
          v: videos
        };
        // Add first video
        vid = videos[0];
      } catch (e) {
        console.error(e);
        return message.channel.send(`Error ocurred while trying to get playlist (or its videos)! If the URL works, you should contact the devs about this, along with this log:\n\`\`\`${e}\`\`\``);
      }
    }
    // Video URLs
    else if (query.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/)) {
      const url = query;
      try {
        // Grab video from query
        query = query
          .replace(/(>|<)/gi, '')
          .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
        const id = query[2].split(/[^0-9a-z_\-]/i)[0];
        vid = await yt.getVideoByID(id);
      } catch (e) {
        console.error(e);
        return message.channel.send(`Error occured while trying to get video! If the URL works, you should contact the devs about this, along with this log:\n\`\`\`${e}\`\`\``);
      }
    }
    // Song/Video Names
    else {
      try {
        // Make loading message
        var loadMsg = await message.channel.send("Loading... *(Searching for videos)*");
        // Search for videos
        const videos = await yt.searchVideos(query, 50);
        if (videos.length == 0)
          return loadMsg.edit("No results.");
        const vidDetails = {};
        const nums = ['one','two','three','four','five'];
        loadMsg.edit("Loading... *(Grabbing details...)*");
        for (let i = 0; i < videos.length; i++) {
          const video = await yt.getVideoByID(videos[i].id, {part: 'statistics'});
          const channel = await yt.getChannelByID(videos[i].channel.id, {part: 'statistics'});
          vidDetails[i] = {};
          vidDetails[i].title = `:${nums[i%5]}: ${videos[i].title}`;
          vidDetails[i].desc = `By [${videos[i].channel.title}](https://www.youtube.com/channel/${videos[i].channel.id}) - ${channel.subscriberCount} subs
          :thumbsup: ${video.raw.statistics.likeCount} • :thumbsdown: ${video.raw.statistics.dislikeCount} • ${video.raw.statistics.viewCount} views • [${Moment(videos[i].publishedAt).format("MMM Do, YYYY, h:mm:ss a [UTC]")}](https://www.timeanddate.com/worldclock/converter.html?iso=${Moment(videos[i].publishedAt).format("YYYYMMDD[T]HHmmss")}&p1=1440&p2=tz_pt&p3=tz_et&p4=tz_eet&p5=tz_jst)
          ${videos[i].description}`;
        }
        // Make embeds
        loadMsg.edit("Loading... *(Making results)*");
        const embeds = [];
        for (let i = 0; i < Math.ceil(videos.length/5); i++) {
          var a = [
            i*5,
            (i*5)+1,
            (i*5)+2,
            (i*5)+3,
            (i*5)+4
          ]
          var embed = new MessageEmbed()
            .setFooter(`Page ${i+1}/${Math.ceil(videos.length/5)}`);
          for (let j = 0; (j+a[j]) < Object.keys(vidDetails).length; j++) {
            embed.addField(vidDetails[a[j]].title,vidDetails[a[j]].desc);
          }
          embeds.push(embed);
        }
        // Make pagination embed
        var page = 0;
        const pageEmbed = new Pagination.Embeds()
          .setArray(embeds)
          .setAuthorizedUsers([message.author.id])
          .setChannel(message.channel)
          .setColor('#e52d27')
          .setTitle('Choose a song by sending a number between 1 and 5.')
          .setDescription('You can also send \'exit\' to exit.')
          .setDisabledNavigationEmojis(['all'])
          .setFunctionEmojis({
            // Custom page functions as Pagination doesn't support variables before it's done (since it's a Promise)
            // Also AFAIK there's no way to end a pagination outside of the thing as well
            '⬅': (_, instance) => {
              instance.setPage('back');
              if (page != 0) page--;
            },
            '➡': (_, instance) => {
              instance.setPage("forward"); 
              if (page != 9) page++;
            }
          })
          .setTimeout(60000)
        .build();
        // Wait and get response
        loadMsg.delete();
        var res;
        try {
          // Using message collector here instead of a function emoji since all of the code
          // would have to be in the promise for the pagination embed
          // and would just be an absolute mess
          const filter = msg => ((msg.content > 0 && msg.content < 6) || msg.content === 'exit') && msg.author.id === message.author.id;
          res = await message.channel.awaitMessages(filter,
            {
              max: 1,
              time: 60000,
              errors: ['time']
            }
          );
        } catch (e) {
          return message.channel.send("Timed out.");
        }
        // Handle response
        if (res.first().content == 'exit') return message.channel.send("Exited.");
        const i = parseInt(res.first().content);
        // Get video
        vid;
        try {
          var index = (i - 1) + (page * 5);
          vid = await yt.getVideoByID(videos[index].id);
        } catch (e) {
          if (e.constructor.name == "TypeError") {
            // Item not in list
            return message.channel.send("That video is not in the list of search results.")
          } else {
            console.error(e);
            return message.channel.send(`An error occured while trying to get that video! You should contact the devs, along with this log:\n\`\`\`${e}\`\`\``);
          }
        }
      } catch (e) {
        console.error(e);
        return message.channel.send(`Error occured while trying to search! *(Or something with the cool embed functionality...woops...)* You should contact the devs about this, along with this log:\n\`\`\`${e}\`\`\``);
      }
    }
    // Apply limitations
    if (settings.stream && vid.raw.snippet.liveBroadcastContent === 'live') 
    return message.channel.send("Live streams are disabled!");
    if (settings.duration != -1 && vid.duration.hours < settings.duration)
    return message.channel.send(`I cannot play videos longer than ${settings.duration} hour${settings.duration != 1 ? 's' : ''}!`);
    // Queue process for single songs
    if (pl === true) {
      try {
        // Add to queue
        var song = {
          url: `https://www.youtube.com/watch?v=${vid.raw.id}`,
          title: vid.title,
          duration: vid.durationSeconds,
          user: message.author.id
        };
        db.queue.push(song);
        await musicDB.reload(); // Reload due to code like song embeds allowing for various changes to the DB to happen while command is being run
        musicDB.push(`/${id}/queue`,db.queue);
        musicDB.save();
        // Play if no song is playing, otherwise say it's added to queue
        if (!db.isPlaying) {
          db.isPlaying = true;
          musicDB.push(`/${id}/isPlaying`,true);
          musicDB.save();
          return playSong(db.queue, message, vc, musicDB, id, settings);
        } 
        return message.channel.send(`${song.title} has been added to the queue! Queue size is now ${db.queue.length}.`);
      } catch (e) {
        console.error(e);
        return message.channel.send(`Error occured while trying to add that song to queue! You shouldn't have to see this. Please contact the devs or bot owner about this, along with this log:\n\`\`\`${e}\`\`\``);
      }
    } 
    // Queue process for playlists
    // TODO: Try and streamline this process and above one
    else {
      try {
        // Add songs to queue
        for (var i = 0; i < pl.l; i++) {
          var v = pl.v[i];
          var song = {
            url: `https://www.youtube.com/watch?v=${v.id}`,
            title: v.title,
            duration: v.durationSeconds,
            user: message.author.id
          }
          db.queue.push(song);
        }
        console.log(pl.v[0]);
        await musicDB.reload();
        musicDB.push(`/${id}/queue`,db.queue);
        musicDB.save();
        // If no song is playing, play it. State songs are added either way.
        if (!db.isPlaying) {
          db.isPlaying = true;
          musicDB.push(`/${id}/isPlaying`,true);
          musicDB.save();
          playSong(db.queue, message, vc, musicDB, id, settings);
        }
        return message.channel.send(`Added ${pl.l} songs from ${pl.t}! Queue size is now ${db.queue.length}.`);
      } catch (e) {
        console.error(e);
        return message.channel.send(`Error ocurred while trying to add those songs to queue! You shouldn't have to see this. Please contact the devs or bot owner about this, along with this log:\n\`\`\`${e}\`\`\``);
      }
    }
  }
}
