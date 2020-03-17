/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * owoify command. Replaces 'L' and 'R' in a message with 'W' to 'owoify' it.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');

module.exports = class OwoifyCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'owoify',
      aliases: ['uwuify'],
      group: 'meme',
      memberName: 'owoify',
      description: 'owoifies a message',
      args: [
        {
          key: 'msg',
          prompt: 'what mwessage dwo you want to owoify onii-chan?',
          type: 'string'
        }
      ]
    });
  }
  async run(message, {msg}) {
    msg = msg.replace('@','*@*');
    msg = msg.replace(/[lr]/g,"w");
    msg = msg.replace(/[LR]/g,"W");
    message.channel.send(msg);
  }
}
