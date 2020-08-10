/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Tourney match listing command on Challonge. Utilizes the Challonge API to list the matches in a tourney.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');
const Challonge = require('challonge');
const Pagination = require('discord-paginationembed');
const {MessageEmbed} = require('discord.js');
const {getPlayerName,getMatch} = require('../../util/challonge');

module.exports = class ChallongeMatchesCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'challongematches',
      aliases: ['cmatches','tourneymatches','tmatches'],
      group: 'esprt',
      memberName: 'challongematches',
      description: 'Shows the current matches in a tourney.',
      details: 'Either an ID (e.g. 10230) or URL (e.g. \'single_elim\' for challonge.com/single_elim) needs to be provided.\nIf assigned to a subdomain, URL format must be `:subdomain-:tournament_url`\n(e.g. \'test-mytourney\' for test.challonge.com/mytourney)',
      examples: [
        'challongematches 696969',
        'challongematches tourney',
        'challongematches subdomain-tourney'
      ],
      args: [
        {
          key: 'id',
          prompt: 'What is the ID or URL of the tourney?',
          type: 'string|integer'
        }
      ]
    });
  }
  async run(message,args) {
    // Create client
    const client = Challonge.createClient({
      apiKey: process.env.challongeapi
    });
    // Index matches
    var matchData = await getMatch(client,args.id).catch((err) => {
      console.error(err);
      message.say('Looks like an error occured.');
      var errortext = (err.errors[0] === undefined) ? err.text : err.errors.join('\n');
      message.say('```' + errortext + '```');
    });
    if (matchData === undefined) return undefined;
    // Make an update message
    const length = Object.keys(matchData).length;
    const updateMsg = await message.say(`Compiling 1/${length} matches...`);
    // Compile all matches into an embed array
    const embeds = [];
    for (let i = 0; i < length; i++) {
      // Grab match data
      var match = matchData[i].match;
      // Grab participant names
      var p1 = {id:match.player1Id};
      p1.name = await getPlayerName(client,args.id,p1.id).catch((err) => console.error(err));
      var p2 = {id:match.player2Id};
      p2.name = await getPlayerName(client,args.id,p2.id).catch((err) => console.error(err));
      // Make embed
      var winner = (p1.id === match.winnerId) ? p1.name : p2.name;
      var state = (match.state === 'open') ? `Started at ${match.startedAt}` : '';
      state = (match.state === 'complete') ? `Winner: ${winner}` : state;
      state = (match.state === 'closed') ? 'The match has been closed.' : state; 
      state = (match.state === 'pending') ? 'The match is still pending.': state;
      var curr = new MessageEmbed()
        .setTitle(`Match #${i+1}: ${p1.name} vs. ${p2.name}`)
        .setDescription(`Match ${match.identifier}, Round ${match.round}`)
        .addField(`Match is ${match.state}.`,state)
        .setFooter(`Created on ${match.createdAt}\nLast updated on ${match.updatedAt}`);
      // Push to array
      embeds.push(curr);
      // Update message
      if ((i+1) % 5 === 0) await updateMsg.edit(`Compiling ${i+1}/${length} matches...`);
    }
    // Remove update message
    updateMsg.delete();
    // Build pagination embed
    new Pagination.Embeds()
      .setArray(embeds)
      .setChannel(message.channel)
      .setPageIndicator(true)
      .setColor(0xFFA500)
      .build();
  }
}
