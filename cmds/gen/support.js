/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Simple support command.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');

module.exports = class SupportCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'support',
      aliases: ['server','helpserver','supportserver'],
      group: 'gen',
      memberName: 'support',
      description: 'Links the support server.'
    });
  }
  async run(message) {
    message.channel.send("Need help? Check out the support server: https://discord.gg/N5HnVrA");
  }
}
