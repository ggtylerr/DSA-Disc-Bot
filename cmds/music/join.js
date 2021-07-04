/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Joining command. Simple command that connects the bot to a VC.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');

const JsonDB = require('node-json-db').JsonDB;
const DBConfig = require('node-json-db/dist/lib/JsonDBConfig').Config;

var musicDB = new JsonDB(new DBConfig(process.env.appRoot + "/db/musicDB",false,true,'/'));
var serverDB = new JsonDB(new DBConfig(process.env.appRoot + "/db/serverDB",false,true,'/'));

const {playSong} = require('../../util/music');
const Config = require('../../config');

module.exports = class JoinCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'join',
      aliases: ['summon'],
      group: 'music',
      memberName: 'join',
      guildOnly: true,
      description: 'Joins a VC if user is in one'
    });
  }
  async run(message) {
    // Get VC and check if the bot is actually on one
    const vc = message.member.voice.channel;
    if (!vc) return message.channel.send("You aren't in a VC! Join one, then retry the command.");
    const id = message.guild.id;
    // Join VC
    vc.join();
    // Get DB
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
    // Start dispatcher if stuff in queue
    if (db.isPlaying || !(db.queue === undefined || db.queue === [])) {
      try {
        musicDB.push(`/${id}/isPlaying`,true);
        musicDB.save();
        return playSong(db.queue, message, vc, musicDB, id, settings);
      } catch (e) {
        console.error(e);
        return message.channel.send(`Error occurred while saving DB! You shouldn't have to see this. Please contact the devs or bot owner about this, along with this log:\n\`\`\`${e}\`\`\``);
      }
    }
    // Otherwise state the bot joined
    return message.reply("Joined VC!");
  }
}
