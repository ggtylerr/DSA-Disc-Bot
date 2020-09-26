/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Various discord.gg embed generators for smash.gg.
 * 
 * ~~~developed by ggtylerr~~~
 */

const {MessageEmbed} = require('discord.js');
const moment = require('moment-timezone');

exports.event = function (d,slug,u) {
  const embed = new MessageEmbed()
    .setColor('#CB333B')
    .setAuthor('Provided by ' + u.username,u.avatarURL())
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
  
  // Return embed
  return embed;
}

exports.league = function(d,slug,u) {
  const embed = new MessageEmbed()
      .setColor('#CB333B')
      .setAuthor('Provided by ' + u.username,u.avatarURL())
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

    // Return embed
    return embed;
}

exports.tourney = function(d,slug,u) {
  const embed = new MessageEmbed()
    .setColor('#CB333B')
    .setAuthor(`Provided by ${u.username}`,u.avatarURL())
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

  return embed;
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