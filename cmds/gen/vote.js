/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Simple voting command. Sends a message based on arg and adds voting reactions to it.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');

module.exports = class VoteCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'vote',
      aliases: ['poll'],
      group: 'gen',
      memberName: 'vote',
      description: 'Makes a vote message',
      details: 'Adds a thumbs up and down for voting. Remove reactions added by this bot to get a more accurate result.',
      args: [
        {
          key: 'msg',
          prompt: 'What do you want to make a vote on?',
          type: 'string'
        }
      ]
    });
  }
  async run(message,{msg}) {
    message.channel.send({
      content: 'Vote on `' + msg + '`\n',
      allowedMentions: { parse: [] }
    })
    .then(function (message) {
      message.react("👍");
      message.react("👎");
    });
  }
}
