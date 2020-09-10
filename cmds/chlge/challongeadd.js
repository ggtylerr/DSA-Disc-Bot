/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Participant addition command on Challonge. Utilizes the Challonge API to add a participant to a tourney.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');
const Challonge = require('challonge');

module.exports = class ChallongeAddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'challongeadd',
      aliases: ['cadd'],
      group: 'chlge',
      memberName: 'challongeadd',
      description: 'Adds a participant to a tourney.',
      details: 'Either an ID (e.g. 10230) or URL (e.g. \'single_elim\' for challonge.com/single_elim) needs to be provided.\nIf assigned to a subdomain, URL format must be `:subdomain-:tournament_url`\n(e.g. \'test-mytourney\' for test.challonge.com/mytourney)',
      examples: [
        'challongeadd myapikey 696969 Nice',
        'challongeadd mykulkey tourney twitch.tv/ggtylerr ggtylerr notan@email.com',
        'challongeadd mycoolkey subdomain-tourney N5HnVrA cool cool@email.com 1'
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
          key: 'name',
          prompt: 'What is the name of the participant that you want to add?',
          type: 'string'
        },
        {
          key: 'challongename',
          prompt: 'What is the participant\'s username on Challonge?',
          type: 'string',
          default: ''
        },
        {
          key: 'email',
          prompt: 'What is the participant\'s email on Challonge?',
          type: 'string',
          default: ''
        },
        {
          key: 'seed',
          prompt: 'What should the participant\'s seed be?',
          type: 'integer',
          default: ''
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
    // Add to a tourney
    client.participants.create({
      id: args.id,
      participant: {
        name: args.name,
        'challonge_name': args.challongename,
        email: args.email,
        seed: args.seed
      },
      callback: (err,data) => {
        if (err !== null) {
          console.error(err);
          message.say('Looks like an error occured.');
          var errortext = (err.errors[0] === undefined) ? err.text : err.errors.join('\n');
          message.say('```' + errortext + '```');
        } 
        else message.say(`${data.participant.name} has been successfully added!`);
      }
    });
  }
}
