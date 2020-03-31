/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Reset command on Challonge. Utilizes the Challonge API to reset a tourney.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');
const Challonge = require('challonge');

module.exports = class ChallongeResetCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'challongereset',
      aliases: ['creset','tourneyreset','treset'],
      group: 'esprt',
      memberName: 'challongereset',
      description: 'Resets a tourney.',
      details: 'Resets a tourney, clearing all of its score and attachments. You can then add/remove/edit participants before starting it again.\nEither an ID (e.g. 10230) or URL (e.g. \'single_elim\' for challonge.com/single_elim) needs to be provided.\nIf assigned to a subdomain, URL format must be `:subdomain-:tournament_url`\n(e.g. \'test-mytourney\' for test.challonge.com/mytourney)',
      examples: [
        'challongereset myapikey 696969',
        'challongereset mykulkey tourney',
        'challongereset mycoolkey subdomain-tourney'
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
    // Reset tourney
    client.tournaments.reset({
      id: args.id,
      callback: (err,data) => {
        if (err !== null) {
          console.error(err);
          message.say('Looks like an error occured.');
          var errortext = (err.errors[0] === undefined) ? err.text : err.errors.join('\n');
          message.say('```' + errortext + '```');
        } 
        else message.say('The tournament has been reset.');
      }
    });
  }
}
