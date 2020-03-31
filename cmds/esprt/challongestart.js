/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Start command on Challonge. Utilizes the Challonge API to start a tourney.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');
const Challonge = require('challonge');

module.exports = class ChallongeStartCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'challongestart',
      aliases: ['cstart','tourneystart','tstart'],
      group: 'esprt',
      memberName: 'challongestart',
      description: 'Starts a tourney.',
      details: 'Starts a tourney, opening up first round matches for reporting. The tourney must have at least 2 participants.\nEither an ID (e.g. 10230) or URL (e.g. \'single_elim\' for challonge.com/single_elim) needs to be provided.\nIf assigned to a subdomain, URL format must be `:subdomain-:tournament_url`\n(e.g. \'test-mytourney\' for test.challonge.com/mytourney)',
      examples: [
        'challongestart myapikey 696969',
        'challongestart mykulkey tourney',
        'challongestart mycoolkey subdomain-tourney'
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
    // Start tourney
    client.tournaments.start({
      id: args.id,
      callback: (err,data) => {
        if (err !== null) {
          console.error(err);
          message.say('Looks like an error occured.');
          var errortext = (err.errors[0] === undefined) ? err.text : err.errors.join('\n');
          message.say('```' + errortext + '```');
        } 
        else message.say('The tournament has been started.');
      }
    });
  }
}
