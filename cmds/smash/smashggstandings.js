/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Standings info command on smash.gg. Utilizes smash.gg's GraphQL API and generated embeds to display information on standings from an event or league hosted on smash.gg.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');
const {GraphQLClient} = require('graphql-request');
const fs = require('fs');
const {standings} = require('../../util/smash/embedgen');
const {convert,urlTest} = require('../../util/smash/slugutils');

module.exports = class SmashGGStandingsCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'smashggstandings',
      aliases: ['sstandings','ss'],
      group: 'smash',
      memberName: 'smashggstandings',
      description: 'Get standings from an event or league.',
      details: 'Tourneys not supported due to limitations on smash.gg\'s API. To view all participants in a tourney, do (command not yet implemented)',
      examples: [
        'smashggstandings tournament/silver-state-smash-3/event/smash-ultimate-singles',
        'ss http://smash.gg/tournament/silver-state-smash-3/event/smash-ultimate-singles',
        'smashggstandings bud-light-beer-league-2020',
        'ss http://smash.gg/league/bud-light-beer-league-2020'
      ],
      args: [
        {
          key: 'slug',
          prompt: 'What event or league do you want?',
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

    // Determine type
    var tq = "query x($s:String){league(slug:$s){name}}";
    var tv = {s:slug};
    var td = await GQLClient.request(tq,tv);
    var t = "league";
    if (td.league === null) {
      tq = "query x($s:String){event(slug:$s){name}}";
      t = "event";
      try {
        td = await GQLClient.request(tq,tv);
        if (td.event === null) {
          return message.reply("That is not a valid league/event/URL.");
        }
      } catch (e) {
        return message.reply("That is not a valid league/event/URL.");
      }
    }
    
    // Set query and vars
    const query = fs.readFileSync(`././util/smash/schema/${t}standings.gql`, 'utf8');
    const vars = {slug:slug};

    // Get response
    const data = await GQLClient.request(query, vars);
    const d = data[t];
    
    // Generate and send embed
    standings(d,slug,this.client.user,message);
  }
}