/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * smash.gg queue command. Utilizes node-json-db to make channel specific queues.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');

const JsonDB = require('node-json-db').JsonDB;
const Config = require('node-json-db/dist/lib/JsonDBConfig').Config;
const {GraphQLClient} = require('graphql-request');
const {convert,urlTest} = require('../../util/smash/slugutils');

var serverDB = new JsonDB(new Config(process.env.appRoot + "/db/serverDB",false,true,'/'));
var channelDB = new JsonDB(new Config(process.env.appRoot + "/db/channelDB",false,true,'/'));

module.exports = class SmashGGQueueCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'smashqueue',
      aliases: ['squeue','sq'],
      group: 'sggqu',
      memberName: 'smashqueue',
      description: 'Queues up a tournament or league to be ready for commands.',
      details: 'Can be set to admin only using the command `smashqueueadmin`',
      examples: ['smashqueue silver-state-smash-3'],
      args: [
        {
          key: 'slug',
          prompt: 'What tournament do you want?\n(Paste in the end of the URL like so: silver-state-smash-3)',
          type: 'string'
        }
      ]
    });
  }
  async run(message, {slug}) {
    // Load databases
    serverDB.load();
    channelDB.load();
    // Check if the command should only be run by admins
    var id = message.channel.guild.id;
    var dbd8a = false;
    try {
      dbd8a = serverDB.getData(`/${id}/smashqueueadmin`);
    } catch (e) {
      // Not set as admin only, ignore.
    }
    if (dbd8a && !message.member.hasPermission('ADMINISTRATOR')) {
      return message.reply('This command can only be used by people have who admin perms!');
    }
    // If slug is URL, convert it.
    if (urlTest(slug)) slug = convert(slug);
    // Make sure links work
    const { Headers } = require('cross-fetch');
    global.Headers = global.Headers || Headers;
    const GQLClient = new GraphQLClient("https://api.smash.gg/gql/alpha", {
      headers: {
        authorization: `Bearer ${process.env.smashggapi}`
      }
    });
    // Test if it's a tournament
    var query = "query x($s:String){tournament(slug:$s){name}}";
    var vars = {s:slug};
    var type = "t";
    var data = await GQLClient.request(query, vars);
    if (data.tournament === null) {
      // Test if it's a league
      query = "query x($s:String){league(slug:$s){name}}";
      type = "l";
      data = await GQLClient.request(query, vars);
      if (data.league === null) {
        // Test if it's an event
        query = "query x($s:String){event(slug:$s){name}}";
        type = "e";
        data = await GQLClient.request(query,vars);
        if (data.event === null) {
          // Slug failed all tests
          return message.reply('This url doesn\'t work.');
        }
      }
    }
    // Push to channel database
    var cid = message.channel.id;
    channelDB.push(`/${cid}/sq/link`,slug);
    channelDB.push(`/${cid}/sq/type`,type);
    channelDB.save();
    if (type == "t") {
      var displayType = "tourney";
      var name = data.tournament.name;
    }
    if (type == "l") {
      displayType = "league";
      name = data.league.name;
    }
    if (type == "e") {
      displayType = "event";
      name = data.event.name;
    }
    message.channel.send(`Queue updated! New queued ${displayType}: ${name}`);
  }
}
