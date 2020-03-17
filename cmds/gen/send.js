/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Simple sending command. Italicizes @ to prevent pings.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');

module.exports = class SendCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'send',
      aliases: ['msg','sendmsg'],
      group: 'gen',
      memberName: 'send',
      description: 'Makes me send a message.',
      details: '@ becomes italicized to prevent pings. Max possible characters is 1995 (assuming the prefix is 1 character and you\'re doing \'msg\' and not \'send\')',
      args: [
        {
          key: 'msg',
          prompt: 'What message do you want to make me send?',
          type: 'string'
        }
      ]
    });
  }
  async run(message, {msg}) {
    let msg = args.join(' ').replace('@','*@*');
    message.delete();
    if (msg == '') message.channel.send('*** ***');
    else message.channel.send(msg);
  }
}
