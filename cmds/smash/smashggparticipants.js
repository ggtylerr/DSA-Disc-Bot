/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Participants command on smash.gg. Utilizes smash.gg's GraphQL API and generated embeds to display information on participants from a tourney hosted on smash.gg.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');
const {GraphQLClient} = require('graphql-request');
const fs = require('fs');
const {participants} = require('../../util/smash/embedgen');
const {convert,urlTest} = require('../../util/smash/slugutils');

module.exports = class SmashGGParticipantsCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'smashggparticipants',
      aliases: ['sparticipants','sp'],
      group: 'smash',
      memberName: 'smashggparticipants',
      description: 'Get participants from a tourney.',
      details: 'Events/leagues not supported due to limitations on smash.gg\'s API. To view those standings, do `smashggstandings`.',
      examples: [
        'smashggparticipants tournament/silver-state-smash-3',
        'sp http://smash.gg/tournament/silver-state-smash-3'
      ],
      args: [
        {
          key: 'slug',
          prompt: 'What tourney do you want?',
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

    // If slug is URL, convert it.
    if (urlTest(slug)) slug = convert(slug);
    
    // Set query and vars
    const query = fs.readFileSync(`././util/smash/schema/tourneyParticipants.gql`, 'utf8');
    const vars = {slug:slug};

    // Get response
    const data = await GQLClient.request(query, vars);
    const d = data.tournament;
    
    // Generate and send embed
    participants(d,slug,this.client.user,message);
  }
}