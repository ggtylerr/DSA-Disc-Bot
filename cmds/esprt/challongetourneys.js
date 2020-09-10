/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Tourney listing command on Challonge. Utilizes the Challonge API to list the tourneys on an account.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');
const Challonge = require('challonge');
const Pagination = require('discord-paginationembed');
const {RichEmbed} = require('discord.js');
const {getTourneys} = require('../../util/challonge');

module.exports = class ChallongeTourneysCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'challongetourneys',
      aliases: ['ctourneys','tourneytourneys','ttourneys'],
      group: 'esprt',
      memberName: 'challongetourneys',
      description: 'Shows the tournaments on an account.',
      details: 'Requires an API key and deletes your message after updating it to protect it.\nYou can get an API key here: https://challonge.com/settings/developer\nPlease note that this requires a verified email.',
      examples: [
        'challongetourneys myapikey',
      ],
      args: [
        {
          key: 'api_key',
          prompt: 'What is your API key?',
          type: 'string'
        }
      ]
    });
  }
  async run(message,args) {
    message.delete();
    // Create client
    const client = Challonge.createClient({
      apiKey: process.env.challongeapi
    });
    // Index tourneys
    var tourneyData = await getTourneys(client).catch((err) => {
      console.error(err);
      message.say('Looks like an error occured.');
      var errortext = (err.errors[0] === undefined) ? err.text : err.errors.join('\n');
      message.say('```' + errortext + '```');
    });
    if (tourneyData === undefined) return undefined;
    // Make an update message
    const length = Object.keys(tourneyData).length;
    if (length === 0) return message.say('You don\'t have any tourneys on your account!');
    const updateMsg = await message.say(`Compiling 1/${length} tourneys...`);
    // Compile all tourneys into an embed array
    const embeds = [];
    for (let i = 0; i < length; i++) {
      // Grab tourney data
      var tourney = tourneyData[i].tournament;
      // Make embed
      var curr = new RichEmbed()
        .setTitle(`Tourney #${i+1}: ${tourney.name}`)
        .setDescription(tourney.description || "No description")
        .setThumbnail(tourney.liveChallongeUrl)
        .addField('Details',`Game: ${tourney.gameName}\nType: ${tourney.tournamentType}\nState: ${tourney.state}\nParticipants: ${tourney.participantsCount}\nID: ${tourney.id}\nURL: ${tourney.fullChallongeUrl}`)
        .setFooter(`Created on ${tourney.createdAt}\nLast updated on ${tourney.updatedAt}`);
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
