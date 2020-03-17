/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Randomize case command. Randomizes the case (between upper and lower case) of a message given.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');

module.exports = class RNGCaseCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'rngcase',
      aliases: ['randomcase'],
      group: 'gen',
      memberName: 'rngcase',
      description: 'Randomize the case of a message.',
      details: 'Randomize the case (lowercase or uppercase) for each letter in a message.',
      args: [
        {
          key: 'msg',
          prompt: 'What message do you want to randomize the case of?',
          type: 'string'
        }
      ]
    });
  }
  async run(message, {msg}) {
    msg = msg.replace('@','*@*')
    var newmsg = "";
    for (var i = 0; i < msg.length; i++) {
      newmsg += (Math.floor(Math.random()*2)==0) ? msg.charAt(i).toLowerCase() : msg.charAt(i).toUpperCase();
    }
    message.channel.send(newmsg);
  }
}
