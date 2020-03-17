/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Simple meme command.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');

module.exports = class CumCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'cum',
      aliases: ['cumchalice','chalice'],
      group: 'meme',
      memberName: 'cum',
      description: '**CONSUME THE CUM CHALICE**'
    });
  }
  async run(message) {
    message.channel.send("**CONSUME THE CUM CHALICE**\n\nhttps://giphy.com/gifs/cum-consume-chalice-LmOFVhdbZZrPZUHDEa");
  }
}
