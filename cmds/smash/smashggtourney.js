/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Tourney info command on smash.gg. Utilizes smash.gg's GraphQL API and generated embeds to display information on a tournament hosted on smash.gg.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');
const {GraphQLClient} = require('graphql-request');
const fs = require('fs');
const {tourney} = require('../../util/smash/embedgen');

module.exports = class SmashGGTourneyCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'smashggtourney',
      aliases: ['stourney','st'],
      group: 'smash',
      memberName: 'smashggtourney',
      description: 'Get info from a tournament.',
      details: 'Does not display information on events, phases, etc.',
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
    const vars = {slug:slug};

    // Get response
    const data = await GQLClient.request(query, vars);
    const d = data.tournament;
    
    // Generate and send embed
    message.channel.send(tourney(d,slug,this.client.user));
  }
}