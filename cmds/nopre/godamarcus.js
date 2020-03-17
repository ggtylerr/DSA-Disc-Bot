/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Simple meme command.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');

module.exports = class GoDaMarcusCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'go da marcus',
      aliases: ['go the marcus'],
      group: 'nopre',
      memberName: 'godamarcus',
      description: 'go da marcus',
      patterns: [/^go da marcus$/gi,/^go the marcus$/gi]
    });
  }
  async run(message) {
    message.channel.send("go da marcus");
  }
}
