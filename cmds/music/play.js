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

module.exports = class PlayCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'play',
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
    // Get database info
    const vcid = vc.id;
    var db = {
      queue: [],
      isPlaying: false
    }
    try {
      await musicDB.reload();
      var a = musicDB.getData(`/${vcid}`);
      db = a;
    } catch (e) {
      if (e.constructor.name == "DataError") {
        musicDB.push(`/${vcid}`,db);
      } else {
        console.error(e);
        message.channel.send(`Error occurred while getting DB! You shouldn't have to see this. Please contact the devs or bot owner about this, along with this log:\n\`\`\`${e}\`\`\``);
      }
    }
    // Check for queue limit
    if (Config.MQueueLimit != -1 && db.queue.length > Config.MQueueLimit)
      return message.channel.send('Queue limit reached! Either wait a bit or remove some songs.');
    // Get video from query
    var vid;
    var song;
    // URLs
    if (query.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/)) {
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
        const vidDetails = {};
        const nums = ['one','two','three','four','five'];
        loadMsg.edit("Loading... *(Grabbing details...)*");
        for (let i = 0; i < videos.length; i++) {
          const vid = await yt.getVideoByID(videos[i].id, {part: 'statistics'});
          const channel = await yt.getChannelByID(videos[i].channel.id, {part: 'statistics'});
          vidDetails[i] = {};
          vidDetails[i].title = `:${nums[i%5]}: ${videos[i].title}`;
          vidDetails[i].desc = `By [${videos[i].channel.title}](https://www.youtube.com/channel/${videos[i].channel.id}) - ${channel.subscriberCount} subs
          :thumbsup: ${vid.raw.statistics.likeCount} • :thumbsdown: ${vid.raw.statistics.dislikeCount} • ${vid.raw.statistics.viewCount} views • [${Moment(videos[i].publishedAt).format("MMM Do, YYYY, h:mm:ss a [UTC]")}](https://www.timeanddate.com/worldclock/converter.html?iso=${Moment(videos[i].publishedAt).format("YYYYMMDD[T]HHmmss")}&p1=1440&p2=tz_pt&p3=tz_et&p4=tz_eet&p5=tz_jst)
          ${videos[i].description}`;
        }
        // Make embeds
        loadMsg.edit("Loading... *(Making results)*");
        const embeds = [];
        for (let i = 0; i < 10; i++) {
          var a = [
            i*5,
            (i*5)+1,
            (i*5)+2,
            (i*5)+3,
            (i*5)+4
          ]
          embeds.push(new MessageEmbed()
            .addField(vidDetails[a[0]].title, vidDetails[a[0]].desc)
            .addField(vidDetails[a[1]].title, vidDetails[a[1]].desc)
            .addField(vidDetails[a[2]].title, vidDetails[a[2]].desc)
            .addField(vidDetails[a[3]].title, vidDetails[a[3]].desc)
            .addField(vidDetails[a[4]].title, vidDetails[a[4]].desc)
            .setFooter(`Page ${i+1}/10`)
          );
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
          console.error(e);
          return message.channel.send(`An error occured while trying to get that video! You should contact the devs, along with this log:\n\`\`\`${e}\`\`\``)
        }
        const url = `https://www.youtube.com/watch?v=${vid.raw.id}`;
        const title = vid.title;
        song = {
          url,
          title
        }
      } catch (e) {
        console.error(e);
        return message.channel.send(`Error occured while trying to search! *(Or something with the cool embed functionality...woops...)* You should contact the devs about this, along with this log:\n\`\`\`${e}\`\`\``);
      }
    }
    // Apply limitations
    if (Config.YTNoStreams && vid.raw.snippet.liveBroadcastContent === 'live') 
    return message.channel.send("Live streams are disabled!");
    if (Config.YTDuration != -1 && vid.duration.hours < Config.YTDuration)
    return message.channel.send(`I cannot play videos longer than ${Config.YTDuration} hour${Config.YTDuration != 1 ? 's' : ''}!`);
    // Queue process
    try {
      // Add to queue
      db.queue.push(song);
      await musicDB.reload(); // Reload due to code like song embeds allowing for various changes to the DB to happen while command is being run
      musicDB.push(`/${vcid}/queue`,db.queue);
      musicDB.save();
      // Play if no song is playing, otherwise say it's added to queue
      if (!db.isPlaying) {
        db.isPlaying = true;
        musicDB.push(`/${vcid}/isPlaying`,true);
        musicDB.save();
        return playSong(db.queue, message, vc, musicDB);
      } 
      else return message.channel.send(`${song.title} has been added to the queue! Queue size is now ${db.queue.length}.`);
    } catch (e) {
      return message.channel.send(`Error occured while trying to add that song to queue! You shouldn't have to see this. Please contact the devs or bot owner about this, along with this log:\n\`\`\`${e}\`\`\``);
    }
  }
}
