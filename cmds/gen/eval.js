/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Eval command, semi based on Commando's original eval command.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');

module.exports = class EvalCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'eval',
      group: 'gen',
      memberName: 'eval',
      description: 'Executes JavaScript code.',
      details: 'Only the bot owner(s) may use this command.',
      args: [
        {
          key: 'code',
          type: 'string',
          prompt: 'What code do you want to execute?',
          default: '"Hello, World!"',
        }
      ]
    });
  }
  async run(message, {code}) {
    if (message.author.id === '143117463788191746') {
      message.channel.send(`Nice :sunglasses:\n__-----------__\n${eval(code)}`);
    } else {
      message.channel.send('haha this command is disabled for normal users, nice try ;)');
    }
  }
}
