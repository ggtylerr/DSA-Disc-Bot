/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Tourney by state command on smash.gg. Utilizes smash.gg's GraphQL API and generated embeds to query tournaments based on their state.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');
const {GraphQLClient} = require('graphql-request');
const {MessageEmbed} = require('discord.js');
const fs = require('fs');
const Pagination = require('discord-paginationembed');

module.exports = class SmashGGTourneyStateCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'smashggtourneystate',
      aliases: ['stourneystate','ststate','sts'],
      group: 'smash',
      memberName: 'smashggtourneystate',
      description: 'Find tourneys based on their state.',
      args: [
        {
          key: 'state',
          prompt: 'What state do you want?\n(e.g. CA, NV, NY)',
          type: 'string'
        }
      ]
    });
  }
  async run(message, {state}) {
    // Init client
    const GQLClient = new GraphQLClient("https://api.smash.gg/gql/alpha", {
      headers: {
        authorization: `Bearer ${process.env.smashggapi}`
      }
    });

    // Set query and vars
    const query = fs.readFileSync('././util/smash/tourneyState.gql', 'utf8');
    const vars = {state:state};

    // Get response
    const data = await GQLClient.request(query, vars);
    const d = data.tournaments.nodes;

    // Generate embeds
    const embeds = [];
    const updateMsg = await message.say(`Getting 1/${d.length} tourneys...`);
    for (var i = 1; i <= d.length; i++) {
      var j = i-1;
      var curr = new MessageEmbed()
        .setAuthor('Provided by ' + this.client.user.username,this.client.user.avatarURL())
        .setURL(d[j].url)
        .setTitle(d[j].name)
        .setFooter(`Page ${i}/${d.length}`)
      // Add description
      if (d[j].numAttendees !== null) {
        curr.setDescription(`Attendees: ${d[j].numAttendees}\nFor more info, run \`stourney ${d[j].slug}\` or go to the URL.`);
      } else {
        curr.setDescription(`Nobody is attending this tourney.\nFor more info, run \`stourney ${d[j].slug}\` or go to the URL.`)
      }
      // Add image
      if (d[j].images !== [] && d[j].images[0] !== undefined) {
        curr.setThumbnail(d[j].images[0].url);
      }
      // Add events
      if (d[j].events !== null && d[j].events !== []) {
        var event = "*(only showing first 2)*\n";
        for (var foo in d[j].events) {
          var bar = d[j].events[foo];
          event += `${bar.name}\n*${bar.videogame.displayName}*\n\`sevent ${bar.slug}\`\n`;
        }
        curr.addField("Events",event);
      }
      // Push and update
      embeds.push(curr);
      if (i % 10 === 0) await updateMsg.edit(`Getting ${i}/${d.length} tourneys...`);
    }
    // Remove update message
    updateMsg.delete();
    // Build pagination embed
    new Pagination.Embeds()
      .setArray(embeds)
      .setChannel(message.channel)
      .setColor(0xCB333B)
      .build();
  }
}