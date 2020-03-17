/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Simple meme command.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');

module.exports = class GoldCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'gold',
      aliases: ['reddit','redditgold'],
      group: 'meme',
      memberName: 'gold',
      description: 'Give reddit gold.'
    });
  }
  async run(message) {
    message.channel.send("Thanks for the gold, kind stranger!");
  }
}
