/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Queued event info command. Gets information on a queued event hosted on smash.gg.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');
const {GraphQLClient} = require('graphql-request');
const fs = require('fs');
const {event} = require('../../util/smash/embedgen');
const JsonDB = require('node-json-db').JsonDB;
const Config = require('node-json-db/dist/lib/JsonDBConfig').Config;

var channelDB = new JsonDB(new Config(process.env.appRoot + "/db/channelDB",false,true,'/'));

module.exports = class SmashGGQueueEventCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'smashggqueueevent',
      aliases: ['squeueevent','sqe'],
      group: 'smash',
      memberName: 'smashggqueueevent',
      description: 'Get info from a queued event.',
      details: 'Does not display info on phases due to restrictions on smash.gg\'s API.'
    });
  }
  async run(message) {
    // Load databases
    channelDB.load();
    // Get queue data
    var id = message.channel.id;
    var q = null;
    try {
      q = channelDB.getData(`/${id}/sq`);
    } catch (e) {
      return message.channel.send("There is nothing in the queue.");
    }
    // Cancel if the queued item isn't an event
    if (q.type !== "e") {
      return message.channel.send("The current queued item is not an event!");
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
    const query = fs.readFileSync('././util/smash/schema/event.gql', 'utf8');
    const vars = {slug:q.link};

    // Get response
    const data = await GQLClient.request(query, vars);
    const d = data.event;
    
    // Generate and send embed
    message.channel.send(event(d,q.link,this.client.user));
  }
}