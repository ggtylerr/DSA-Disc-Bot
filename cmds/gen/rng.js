/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Simple RNG command. Chooses number from 1 to N.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');

module.exports = class RNGCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'rng',
      aliases: ['random','rngnums','randomnums'],
      group: 'gen',
      memberName: 'rng',
      description: 'Random number from 1 thru (num)',
      details: 'Chooses a random number from 1 through (number). Can accept decimals, but doesn\'t output a decimal. Does not work with any number less than 1.',
      examples: ['rng 10'],
      args: [
        {
          key: 'num',
          prompt: 'What should the max number be?',
          type: 'float'
        }
      ]
    });
  }
  async run(message,args) {
    message.channel.send(Math.floor((Math.random() * parseFloat(args.num)) + 1));
  }
}
