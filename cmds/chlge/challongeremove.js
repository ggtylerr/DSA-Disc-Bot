/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Participant removal command on Challonge. Utilizes the Challonge API to remove a participant from a tourney.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');
const Challonge = require('challonge');

module.exports = class ChallongeRemoveCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'challongeremove',
      aliases: ['cremove'],
      group: 'chlge',
      memberName: 'challongeremove',
      description: 'Removes a participant to a tourney.',
      details: 'If the tourney has not started, it will remove a participant and automatically fill the abandoned seed number.\nIf the tourney is ongoing, it will mark it as inactive, automatically forfeiting his/her/its matches.\nEither an ID (e.g. 10230) or URL (e.g. \'single_elim\' for challonge.com/single_elim) needs to be provided.\nIf assigned to a subdomain, URL format must be `:subdomain-:tournament_url`\n(e.g. \'test-mytourney\' for test.challonge.com/mytourney)',
      examples: [
        'challongeremove myapikey 696969 Nice',
        'challongeremove mykulkey tourney twitch.tv/ggtylerr',
        'challongeremove mycoolkey subdomain-tourney N5HnVrA'
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
          key: 'participantID',
          prompt: 'What is the ID of the participant that you want to remove?',
          type: 'string'
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
    // Remove from a tourney
    client.participants.destroy({
      id: args.id,
      participantId: args.participantID,
      callback: (err,data) => {
        if (err !== null) {
          console.error(err);
          message.say('Looks like an error occured.');
          var errortext = (err.errors[0] === undefined) ? err.text : err.errors.join('\n');
          message.say('```' + errortext + '```');
        } 
        else message.say(`${data.participant.name} has been successfully removed.`);
      }
    });
  }
}
