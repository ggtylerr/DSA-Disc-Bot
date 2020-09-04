/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Simple yes or no command. Chooses from 0 to 1. If it's 0, it returns Yes. If it's 1, it returns No.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');

module.exports = class YornCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'y/n',
      aliases: ['yorn','yesorno'],
      group: 'gen',
      memberName: 'yorn',
      description: 'Answers a yes/no question.'
    });
  }
  async run(message) {
    message.channel.send((Math.floor(Math.random()*2)==0) ? 'Yes.' : 'No.');
  }
}
