/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Tourney info command on smash.gg. Utilizes smash.gg's GraphQL API and generated embeds to display information on a tournament hosted on smash.gg.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');
const {GraphQLClient} = require('graphql-request');
const {MessageEmbed} = require('discord.js');
const fs = require('fs');
const moment = require('moment-timezone');

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
    const query = fs.readFileSync('././util/smash/tourney.gql', 'utf8');
    const vars = {slug:slug};

    // Get response
    const data = await GQLClient.request(query, vars);
    const d = data.tournament;
    
    // Generate embed
    const embed = new MessageEmbed()
      .setColor('#CB333B')
      .setAuthor(`Provided by ${this.client.user.username}`,this.client.user.avatarURL())
      .setURL(d.url)
      .setTitle(d.name)

    // Add rules if it doesn't exceed limit
    if (d.rules.length <= 1024) {
      embed.addField("Rules",d.rules);
    }

    // Add description
    var ownerName = genName(d.owner.player.prefix,d.owner.player.gamerTag,d.owner.name);
    
    var desc = `${d.name} is created/owned by ${ownerName} There is ${d.numAttendees} attending. This tournament `;
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

    // Add events
    var events = "";
    for (var e in d.events) {
      var f = d.events[e];
      events += `***${f.name}***\nView info about this event using this command \`sevent ${f.slug}\`\n\n`;
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

    // Add participants
    var ptcps = "*(only displaying the first 12)*\n";
    for (var p in d.participants.nodes) {
      var x = d.participants.nodes[p];
      var pre = x.player.prefix;
      var tag = x.player.gamerTag;
      var nme = x.user.name;
      ptcps += `${genName(pre,tag,nme)}\n`;
    }
    if (ptcps == "*(only displaying the first 12)*\n") {
      embed.addField("Participants",ptcps,true);
    } else {
      embed.addField("Participants","Nobody is participating. Be the first one to register!",true);
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