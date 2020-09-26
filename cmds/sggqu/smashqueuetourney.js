/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Queued tourney info command. Gets information on a queued tournament hosted on smash.gg.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');
const {GraphQLClient} = require('graphql-request');
const fs = require('fs');
const {tourney} = require('../../util/smash/embedgen');
const JsonDB = require('node-json-db').JsonDB;
const Config = require('node-json-db/dist/lib/JsonDBConfig').Config;
const QT = require('../../util/smash/queuetypes');

var channelDB = new JsonDB(new Config(process.env.appRoot + "/db/channelDB",false,true,'/'));

module.exports = class SmashGGQueueTourneyCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'smashggqueuetourney',
      aliases: ['squeuetourney','sqt'],
      group: 'sggqu',
      memberName: 'smashggqueuetourney',
      description: 'Get info from a queued tournament.',
      details: 'Does not display information on events, phases, etc.'
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
    // Cancel if the queued item isn't a tourney
    if (q.type !== QT.TOURNEY) {
      return message.channel.send("The current queued item is not a tourney!");
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
    const query = fs.readFileSync('././util/smash/schema/tourney.gql', 'utf8');
    const vars = {slug:q.link};

    // Get response
    const data = await GQLClient.request(query, vars);
    const d = data.tournament;
    
    // Generate and send embed
    message.channel.send(tourney(d,q.link,this.client.user));
  }
}