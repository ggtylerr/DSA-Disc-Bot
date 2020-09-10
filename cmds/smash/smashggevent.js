/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Event info command on smash.gg. Utilizes smash.gg's GraphQL API and generated embeds to display information on a event hosted on smash.gg.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');
const {GraphQLClient} = require('graphql-request');
const {MessageEmbed} = require('discord.js');
const fs = require('fs');
const moment = require('moment-timezone');

module.exports = class SmashGGEventCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'smashggevent',
      aliases: ['sevent'],
      group: 'smash',
      memberName: 'smashggevent',
      description: 'Get info from an event.',
      details: 'Does not display info on phases due to restrictions on smash.gg\'s API.',
      examples: [
        'smashggevent tournament/silver-state-smash-2-5/event/ultimate-singles'
      ],
      args: [
        {
          key: 'slug',
          prompt: 'What event do you want?\n(Paste in the end of the URL like so: tournament/silver-state-smash-2-5/event/ultimate-singles)',
          type: 'string'
        }
      ]
    });
  }
  async run(message, {slug}) {
    // Init client
    const GQLClient = new GraphQLClient("https://api.smash.gg/gql/alpha", {
      headers: {
        authorization: `Bearer ${process.env.smashggapi}`
      }
    });

    // Set query and vars
    const query = fs.readFileSync('././util/smash/event.gql', 'utf8');
    const vars = {slug:slug};

    // Get response
    const data = await GQLClient.request(query, vars);
    const d = data.event;

    // Generate embed
    const embed = new MessageEmbed()
      .setColor('#CB333B')
      .setAuthor('Provided by ' + this.client.user.username,this.client.user.avatarURL())
      .setURL("https://smash.gg/" + slug)
      .setTitle(d.tournament.name + " - " + d.name)
      .setDescription(`This is an event for ${d.tournament.name} on ${d.videogame.displayName} and is ${d.state.toLowerCase()}. Run \`stourney ${d.tournament.slug}\` to see more info on the tournament.\n**Click the blue title to see more info on the event, including brackets, standings, matches, and stats.**`)
      .setThumbnail(d.videogame.images[0].url)

    // Add rules/match rules if it doesn't exceed limit
    if (d.rulesMarkdown !== null && d.rulesMarkdown <= 1024) {
      embed.addField("Rules",d.rulesMarkdown,(d.matchRulesMarkdown !== null && d.matchRulesMarkdown <= 1024));
    };
    if (d.matchRulesMarkdown !== null) {
      embed.addField("Match Rules",d.matchRulesMarkdown,(d.rulesMarkdown !== null && d.rulesMarkdown <= 1024));
    };

    // Add Standings
    var stdgs = "";
    for (var s in d.standings.nodes) {
      var foo = d.standings.nodes[s];
      stdgs += `[${foo.placement}] `
      if (foo.player !== null) {
        // Not listed as entrant
        stdgs += genName(foo.player.prefix,foo.player.gamerTag,foo.player.user.name);
      } else {
        if (foo.entrant.participants.length == 1) {
          // Only one player
          var bar = foo.entrant.participants[0];
          stdgs += genName(bar.prefix,bar.gamerTag,bar.user.name);
        } else {
          // Multiple players
          var bar = "";
          for (var x = 0; x < foo.entrant.participants.length; x++) {
            bar += foo.entrant.participants[x].gamerTag;
            if (x < foo.entrant.participants.length - 1) {
              bar += ", "
            }
          }
          stdgs += `${foo.entrant.name} *${bar}*`
        }
      }
      // Score
      if (foo.stats !== null) {
        if (foo.stats.score !== null) {
          stdgs += ` [${foo.stats.score.label}: ${foo.stats.score.displayValue}]`;
        }
      }
      stdgs += "\n";
    }
    if (stdgs !== "") {
      embed.addField("Standings",stdgs);
    } else {
      embed.addField("Standings","Nobody is attending, or no stands are available.");
    }
    
    // Add timestamps
    var create = new moment.utc(d.createdAt * 1000);
    var start = new moment.utc(d.startAt * 1000);
    var update = new moment.utc(d.updatedAt * 1000);
    if (d.tournament.timezone !== null) {
      create = create.tz(d.tournament.timezone);
      start = start.tz(d.tournament.timezone);
      update = update.tz(d.tournament.timezone);
    }
    create = create.format('MMM Do YYYY, h:mm:ss a (z)');
    start = start.format('MMM Do YYYY, h:mm:ss a (z)');
    update = update.format('MMM Do YYYY, h:mm:ss a (z)');
    embed.setFooter(`Created at ${create}\nStarted at ${start}\nLast updated on ${update}`);
    
    // Send embed
    message.channel.send(embed);
  }
}

function genName(p,t,n) {
  if (p === null || p === "") {
    if (n === null)
      return `${t}`;
    else
      return `${t} *(${n})*`;
  }
  else {
    if (n === null)
      return `[${p}] ${t}`;
    else
      return `[${p}] ${t} *(${n})*`;
  }
}