/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Simple meme command.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');

module.exports = class GeicoCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'geico',
      aliases: ['insurance','please_sponsor_us_geico'],
      group: 'meme',
      memberName: 'geico',
      description: 'Save on car insurance.'
    });
  }
  async run(message) {
    message.channel.send("Save 15% or more on car insurance.");
  }
}
