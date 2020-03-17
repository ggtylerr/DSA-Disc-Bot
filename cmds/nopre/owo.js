/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Simple meme command.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');

module.exports = class OwoCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'owo',
      group: 'nopre',
      memberName: 'owo',
      description: 'What\'s this?',
      patterns: [/^owo$/gi]
    });
  }
  async run(message) {
    message.channel.send("What's this?");
  }
}
