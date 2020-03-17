/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Simple meme command.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');

module.exports = class FCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'f',
      aliases: ['pressf','fbutton','respects','payrespects'],
      group: 'meme',
      memberName: 'f',
      description: 'Presses [F] to pay respects.'
    });
  }
  async run(message) {
    message.channel.send("You have pressed [F] to pay respects.");
  }
}
