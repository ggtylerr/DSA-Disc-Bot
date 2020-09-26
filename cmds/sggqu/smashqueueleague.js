/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Queued league info command. Gets information on a queued league hosted on smash.gg.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');
const {GraphQLClient} = require('graphql-request');
const fs = require('fs');
const {league} = require('../../util/smash/embedgen');
const JsonDB = require('node-json-db').JsonDB;
const Config = require('node-json-db/dist/lib/JsonDBConfig').Config;
const QT = require('../../util/smash/queuetypes');

var channelDB = new JsonDB(new Config(process.env.appRoot + "/db/channelDB",false,true,'/'));

module.exports = class SmashGGQueueLeagueCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'smashggqueueleague',
      aliases: ['squeueleague','sql'],
      group: 'sggqu',
      memberName: 'smashggqueueleague',
      description: 'Get info from a queued league.'
    });
  }
  async run(message) {
    // Load databases
    await channelDB.reload();
    // Get queue data
    var id = message.channel.id;
    var q = null;
    try {
      q = channelDB.getData(`/${id}/sq`);
    } catch (e) {
      return message.channel.send("There is nothing in the queue.");
    }
    // Cancel if the queued item isn't an event
    if (q.type !== QT.LEAGUE) {
      return message.channel.send("The current queued item is not a league!");
    }
    // Init client
    const { Headers } = require('cross-fetch');
    global.Headers = global.Headers || Headers;
    
    const GQLClient = new GraphQLClient("https://api.smash.gg/gql/alpha", {
      headers: {
        authorization: `Bearer ${process.env.smashggapi}`
      }
    })

    // Set query and vars
    const query = fs.readFileSync('././util/smash/schema/league.gql', 'utf8');
    const vars = {slug:q.link};

    // Get response
    const data = await GQLClient.request(query, vars);
    const d = data.league;
    
    // Generate and send embed
    message.channel.send(event(d,q.link,this.client.user));
  }
}