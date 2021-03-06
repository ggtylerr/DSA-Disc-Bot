/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * User info command on smash.gg. Utilizes smash.gg's GraphQL API and generated embeds to display information on a user on smash.gg.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');
const {GraphQLClient} = require('graphql-request');
const {MessageEmbed} = require('discord.js');
const fs = require('fs');
const {convert,urlTest} = require('../../util/smash/slugutils');

module.exports = class SmashGGUserCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'smashgguser',
      aliases: ['suser','su'],
      group: 'smash',
      memberName: 'smashgguser',
      description: 'Get a user\'s info',
      examples: [
        "smashgguser user/a4829083",
        'su https://smash.gg/user/a4829083'
      ],
      args: [
        {
          key: 'slug',
          prompt: 'What user do you want?',
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
    const query = fs.readFileSync('././util/smash/schema/user.gql', 'utf8');
    const vars = {slug:slug};

    // Get response
    const data = await GQLClient.request(query, vars);
    const d = data.user;

    // Generate embed
    const embed = new MessageEmbed()
      .setColor('#CB333B')
      .setAuthor('Provided by ' + this.client.user.username,this.client.user.avatarURL())
      .setURL("https://smash.gg/" + slug)
      .setTitle("User " + genName(d.player.prefix,d.player.gamerTag,d.name));
    
    // Add description
    var desc = "";
    if (d.genderPronoun !== null) {
      desc += `Pronoun: ${d.genderPronoun}. `;
    }
    if (d.birthday !== null && d.birthday !== "") {
      desc += `Birthday: ${d.birthday}. `;
    }
    if (d.location.country !== null) {
      desc += "Location: "
      if (d.location.city !== null) {
        desc += d.location.city + " ";
      }
      if (d.location.state !== null) {
        desc += d.location.state + ", ";
      }
      desc += d.location.country + ". "
    }
    if (d.authorizations !== null) {
      desc += "\nConnections:\n";
      for (var c in d.authorizations) {
        var x = d.authorizations[c];
        desc += `[${normalize(x.type)}: ${x.externalUsername}](${x.url})\n`;
      }
    }
    if (desc == "") {
      desc += "This user doesn't seem to like to customize their profile alot..."
    }
    embed.setDescription(desc);
    
    // Add profile picture
    if (d.images[0] !== null && d.images[0] !== undefined) {
      embed.setThumbnail(d.images[0].url);
    }

    // Add bio
    if (d.bio !== null && d.bio !== "") {
      embed.addField("Bio",d.bio);
    }

    // Add tourneys
    if (d.tournaments.nodes !== null) {
      var tourneys = "***Only showing the first 4***\n";
      for (var t in d.tournaments.nodes) {
        var x = d.tournaments.nodes[t];
        tourneys += `${x.name}\n\`stourney ${x.slug}\`\n`;
      }
      embed.addField("Tournaments participated/organized",tourneys,true);
    }

    // Add events
    if (d.events.nodes !== null) {
      var events = "***Only showing the first 4***\n";
      for (var e in d.events.nodes) {
        var x = d.events.nodes[e];
        events += `${x.name}\n\`sevent ${x.slug}\`\n`;
      }
      embed.addField("Events participated",events,true);
    }

    // Add leagues
    if (d.leagues.nodes !== null) {
      var leagues = "***Only showing the first 4***\n";
      for (var t in d.leagues.nodes) {
        var x = d.leagues.nodes[t];
        leagues += `${x.name}\n\`sleague ${x.slug}\`\n`;
      }
      embed.addField("Leagues participated",leagues,true);
    }

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

function normalize(x) {
  x = x.toLowerCase();
  return x.charAt(0).toUpperCase() + x.slice(1);
}