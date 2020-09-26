/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Event info command on smash.gg. Utilizes smash.gg's GraphQL API and generated embeds to display information on a event hosted on smash.gg.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');
const {GraphQLClient} = require('graphql-request');
const fs = require('fs');
const {event} = require('../../util/smash/embedgen');

module.exports = class SmashGGEventCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'smashggevent',
      aliases: ['sevent','se'],
      group: 'smash',
      memberName: 'smashggevent',
      description: 'Get info from an event.',
      details: 'Does not display info on phases due to restrictions on smash.gg\'s API.',
      examples: [
        'smashggevent tournament/silver-state-smash-3/event/ultimate-singles'
      ],
      args: [
        {
          key: 'slug',
          prompt: 'What event do you want?\n(Paste in the end of the URL like so: tournament/silver-state-smash-3/event/ultimate-singles)',
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
    const query = fs.readFileSync('././util/smash/schema/event.gql', 'utf8');
    const vars = {slug:slug};

    // Get response
    const data = await GQLClient.request(query, vars);
    const d = data.event;

    // Generate and send embed
    message.channel.send(event(d,slug,this.client.user));
  }
}