/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Simple coin flip command.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');

module.exports = class FlipCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'flip',
      aliases: ['coin','coinflip'],
      group: 'gen',
      memberName: 'flip',
      description: 'Flip a coin.'
    });
  }
  async run(message) {
    message.channel.send((Math.floor(Math.random()*2)==0) ? 'Heads.' : 'Tails.');
  }
}
