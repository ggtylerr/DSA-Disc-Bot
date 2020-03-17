/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Simple meme command.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');

module.exports = class Me2Command extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'me2',
      aliases: ['me too','me to','me two','mewtwo'],
      group: 'nopre',
      memberName: 'me2',
      description: 'me too',
      patterns: [/^me2$/gi,/^me too$/gi,/^me to$/gi,/^me two$/gi,/^mewtwo$/gi]
    });
  }
  async run(message) {
    message.channel.send("me too");
  }
}
