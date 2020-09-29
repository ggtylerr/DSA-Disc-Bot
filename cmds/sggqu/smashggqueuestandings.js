/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Queued standings command. Gets information on a queued event/league's standings from smash.gg.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');
const {GraphQLClient} = require('graphql-request');
const fs = require('fs');
const {standings} = require('../../util/smash/embedgen');
const JsonDB = require('node-json-db').JsonDB;
const Config = require('node-json-db/dist/lib/JsonDBConfig').Config;
const QT = require('../../util/smash/queuetypes');

var channelDB = new JsonDB(new Config(process.env.appRoot + "/db/channelDB",false,true,'/'));

module.exports = class SmashGGQueueStandingsCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'smashggqueuestandings',
      aliases: ['squeuestandings','sqs'],
      group: 'smash',
      memberName: 'smashggqueuestandings',
      description: 'Get standings from a queued event or league.',
      details: 'Tourneys not supported due to limitations on smash.gg\'s API. To view all participants in a tourney, do (command not yet implemented)'
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
    // Cancel if the queued item isn't an event or league
    if (q.type !== QT.LEAGUE && q.type !== QT.EVENT) {
      return message.channel.send("The current queued item is not an event or league!");
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
    const query = fs.readFileSync(`././util/smash/schema/${QT[q.type].toLowerCase()}standings.gql`, 'utf8');
    const vars = {slug:q.link};

    // Get response
    const data = await GQLClient.request(query, vars);
    const d = data[QT[q.type].toLowerCase()];
    
    // Generate and send embed
    standings(d,q.link,this.client.user,message);
  }
}