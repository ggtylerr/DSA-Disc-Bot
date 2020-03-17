/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Simple meme command.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');

module.exports = class AyyCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'ayy',
      group: 'nopre',
      memberName: 'ayy',
      description: 'lmao',
      patterns: [/^ayy$/gi]
    });
  }
  async run(message) {
    message.channel.send("lmao");
  }
}
