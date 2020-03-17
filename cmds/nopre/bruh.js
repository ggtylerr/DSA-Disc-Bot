/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Simple meme command.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');

module.exports = class BruhCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'bruh',
      group: 'nopre',
      memberName: 'bruh',
      description: 'Certifies a bruh moment.',
      patterns: [/^bruh$/gi]
    });
  }
  async run(message) {
    message.channel.send("That\'s a bruh moment right there...");
  }
}
