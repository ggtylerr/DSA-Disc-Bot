/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Tourney deletion command on Challonge. Utilizes the Challonge API to delete a tourney.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');
const Challonge = require('challonge');

module.exports = class ChallongeDeleteCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'challongedelete',
      aliases: ['cdelete','challongedestroy','cdestroy'],
      group: 'chlge',
      memberName: 'challongedelete',
      description: 'Deletes a tourney on Challonge.',
      details: 'Once deleted, there is no undo, so be careful!\nEither an ID (e.g. 10230) or URL (e.g. \'single_elim\' for challonge.com/single_elim) needs to be provided.\nIf assigned to a subdomain, URL format must be `:subdomain-:tournament_url`\n(e.g. \'test-mytourney\' for test.challonge.com/mytourney)',
      examples: [
        'challongedelete myapikey 696969',
        'challongedelete mykulkey badtourney',
        'challongedelete mycoolkey subdomain-badtourney'
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
    var id = message.author.id;
    message.delete();
    // Create client
    const client = Challonge.createClient({
      apiKey: args['api_key']
    })
    // Confirm user's action
    message.say('There is no undo after a deletion. If you\'re absolutely sure you want to delete this tourney, please type the ID again: ```' + args.id + '```');
    const c = message.channel.createMessageCollector(m => m.author.id === id, {time: 10000});
    c.on('collect', msg => {
      msg.delete();
      if (msg.content == args.id) {    
        // Delete tourney
        client.tournaments.destroy({
          id: args.id,
          callback: (err,data) => {
            if (err !== null) {
              console.error(err);
              message.say('Looks like an error occured.');
              var errortext = (err.errors[0] === undefined) ? err.text : err.errors.join('\n');
              message.say('```' + errortext + '```');
            } 
            else message.say(`The tournament was successfully deleted. May it rest in peace.`);
          }
        });
      } 
      else message.say('I understand. The tournament is still alive.');
    });
  }
}
