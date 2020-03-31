/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Tourney creation command on Challonge. Utilizes the Challonge API to create a tourney. Also utilizes custom Commando types for multiple optional arguments.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');
const Challonge = require('challonge');

module.exports = class ChallongeCreateCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'challongecreate',
      aliases: ['ccreate','tourneycreate','tcreate'],
      group: 'esprt',
      memberName: 'challongecreate',
      description: 'Creates a tourney on Challonge.',
      details: 'Options are in JSON format. Available options can be found here: https://api.challonge.com/v1/documents/tournaments/create\nRequires an API key and deletes your message after creating it to protect it.\nYou can get an API key here: https://challonge.com/settings/developer\nPlease note that this requires a verified email.',
      examples: [
        'challongecreate abcdef12345 "Cool Tourney" cooltourney',
        'challongecreate superkey "Lol" ecksdee {"tournament_type":"double elimination"}'
      ],
      args: [
        {
          key: 'api_key',
          prompt: 'What is your API key?',
          type: 'string'
        },
        {
          key: 'name',
          prompt: 'What is the name of the tourney?',
          type: 'string',
          validate: name => name.length < 61
        },
        {
          key: 'url',
          prompt: 'What is the URL you want?',
          type: 'string',
          validate: url => !(/([^0-z_])/g.test(url))
        },
        {
          key: 'options',
          prompt: 'What options do you want to specify? (In JSON format)',
          type: 'json',
          default: {}
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
    // Handle options
    var options = args['options'];
    options.name = args.name;
    options.url = args.url;
    // Create tourney
    client.tournaments.create({
      tournament: options,
      callback: (err,data) => {
        if (err !== null) {
          console.error(err);
          message.say('Looks like an error occured.');
          var errortext = (err.errors[0] === undefined) ? err.text : err.errors.join('\n');
          message.say('```' + errortext + '```');
        } 
        else message.say(`The tournament "${args.name}" was successfully created!\nURL: https://challonge.com/${args.url}`);
      }
    });
  }
}
