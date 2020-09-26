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
const {convert,urlTest} = require('../../util/smash/slugutils');

module.exports = class SmashGGLeagueCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'smashggleague',
      aliases: ['sleague','sl'],
      group: 'smash',
      memberName: 'smashggleague',
      description: 'Get info from a league.',
      examples: [
        'smashggleague bud-light-league-2020',
        'sl http://smash.gg/league/bud-light-beer-league-2020'
      ],
      args: [
        {
          key: 'slug',
          prompt: 'What league do you want?',
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

    // If slug is URL, convert it.
    if (urlTest(slug)) slug = convert(slug);

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