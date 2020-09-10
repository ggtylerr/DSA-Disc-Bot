/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * League info command on smash.gg. Utilizes smash.gg's GraphQL API and generated embeds to display information on a league hosted on smash.gg.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');
const {GraphQLClient} = require('graphql-request');
const {MessageEmbed} = require('discord.js');
const fs = require('fs');
const moment = require('moment-timezone');

module.exports = class SmashGGLeagueCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'smashggleague',
      aliases: ['sleague'],
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
    const query = fs.readFileSync('././util/smash/league.gql', 'utf8');
    const vars = {slug:slug};

    // Get response
    const data = await GQLClient.request(query, vars);
    const d = data.league;

    // Generate embed
    const embed = new MessageEmbed()
      .setColor('#CB333B')
      .setAuthor('Provided by ' + this.client.user.username,this.client.user.avatarURL())
      .setURL(d.url)
      .setTitle(d.name);

    // Add description
    var desc = `Here's some stuff about ${d.name}: There is ${d.entrantCount} attending. This league `;
    desc += (d.state == 1) ? "is not active. " : (d.state == 2) ? "is currently active. " : "has been completed. ";
    if (d.isRegistrationOpen) {
      desc += "Registration is open";
      if (d.eventRegistrationClosesAt === null) {
        var x = new moment.utc(d.eventRegistrationClosesAt * 1000);
        if (d.timezone !== null) {
          x = x.tz(d.timezone);
        }
        x = x.format('MMM Do YYYY, h:mm:ss a (z)');
        desc += " and closes at " + x;
      }
      else desc += ". ";
    }
    else desc += "Registration is closed.";
    embed.setDescription(desc);

    // Add rules if it doesn't exceed limit
    if (d.rules !== null) {
      if (d.rules.length <= 1024) {
        embed.addField("Rules",d.rules);
      }
    }

    // Add events
    var events = "(Only showing the first 4)\n";
    for (var e in d.events.nodes) {
      var f = d.events.nodes[e];
      events += `***${f.name}***\n\`sevent ${f.slug}\`\n`;
    }
    embed.addField("Events",events,true);

    // Add contact info + locations
    var cil = "";
    if (d.primaryContactType !== null) {
      cil += `Primary Contact (${d.primaryContactType}): ${d.primaryContact}\n\n`;
    }
    if (d.venueName !== null) {
      cil += `Venue: ${d.venueName}\n`;
      if (d.venueAddress !== "" && d.venueAddress !== null) {
        cil += `Located at: ${d.venueAddress}\n\n`;
      } 
      else cil += "\n";
    } else if (d.venueAddress !== "" && d.venueAddress !== null) {
      cil += `Venue located at: ${d.venueAddress} `;
    }
    if (d.city !== null && d.addrState !== null && d.countryCode !== null) {
      cil += `Taking place at ${d.city} ${d.addrState}, ${d.countryCode}\n\n`;
    }
    if (d.links.facebook !== null || d.links.discord !== null) {
      cil += "Links\n";
      if (d.links.facebook !== null) cil += `Facebook: ${d.links.facebook}\n`;
      else cil += `Discord: ${d.links.discord}`;
      cil += "\n";
    }
    if (cil !== "") {
      embed.addField("Contact Info and Locations",cil,true);
    }

    // Add standings
    var stdgs = "";
    if (d.standings.nodes !== null) {
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
    }
    if (stdgs !== "") {
      embed.addField("Standings",stdgs);
    }

    // Add timestamps
    var start = new moment.utc(d.startAt * 1000);
    var update = new moment.utc(d.updatedAt * 1000);
    var end = new moment.utc(d.endAt * 1000);
    if (d.timezone !== null) {
      start = start.tz(d.timezone);
      update = update.tz(d.timezone);
      end = end.tz(d.timezone);
    }
    start = start.format('MMM Do YYYY, h:mm:ss a (z)');
    update = update.format('MMM Do YYYY, h:mm:ss a (z)');
    end = end.format('MMM Do YYYY, h:mm:ss a (z)');
    embed.setFooter(`Started at ${start}\nEnds (or ended) at ${end}\nLast updated on ${update}`);

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