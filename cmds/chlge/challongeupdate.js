/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Tourney update command on Challonge. Utilizes the Challonge API to update a tourney. Also utilizes custom Commando types for multiple optional arguments.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');
const Challonge = require('challonge');

module.exports = class ChallongeUpdateCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'challongeupdate',
      aliases: ['cupdate'],
      group: 'chlge',
      memberName: 'challongeupdate',
      description: 'Updates a tourney on Challonge.',
      details: 'Options are in JSON format. Available options can be found here: https://api.challonge.com/v1/documents/tournaments/update\nRequires an API key and deletes your message after updating it to protect it.\nYou can get an API key here: https://challonge.com/settings/developer\nPlease note that this requires a verified email.',
      examples: [
        'challongecreate abcdef12345 696969 {name:"Nice"}',
        'challongecreate superkey lol {name:"XD","tournament_type":"double elimination"}'
      ],
      args: [
        {
          key: 'api_key',
          prompt: 'What is your API key?',
          type: 'string'
        },
        {
          key: 'id',
          prompt: 'What is the ID or URL of the tourney?',
          type: 'string|integer'
        },
        {
          key: 'options',
          prompt: 'What options do you want to specify? (In JSON format)',
          type: 'json'
        }
      ]
    });
  }
  async run(message,args) {
    message.delete();
    // Create client
    const client = Challonge.createClient({
      apiKey: args['api_key']
    })
    // Update tourney
    client.tournaments.update({
      id: args.id,
      tournament: args.options,
      callback: (err,data) => {
        if (err !== null) {
          console.error(err);
          message.say('Looks like an error occured.');
          var errortext = (err.errors[0] === undefined) ? err.text : err.errors.join('\n');
          message.say('```' + errortext + '```');
        } 
        else message.say(`The tournament was successfully updated.`);
      }
    });
  }
}
