/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * League info command on smash.gg. Utilizes smash.gg's GraphQL API and generated embeds to display information on a league hosted on smash.gg.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');
const {GraphQLClient} = require('graphql-request');
const fs = require('fs');
const {league} = require('../../util/smash/embedgen');

module.exports = class SmashGGLeagueCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'smashggleague',
      aliases: ['sleague','sl'],
      group: 'smash',
      memberName: 'smashggleague',
      description: 'Get info from a league.',
      args: [
        {
          key: 'slug',
          prompt: 'What league do you want?\n(Paste in the end of the URL like so: bud-light-beer-league-2020)',
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
    });

    // Set query and vars
    const query = fs.readFileSync('././util/smash/schema/league.gql', 'utf8');
    const vars = {slug:slug};

    // Get response
    const data = await GQLClient.request(query, vars);
    const d = data.league;

    // Generate and send embed
    message.channel.send(league(d,slug,this.client.user));
  }
}