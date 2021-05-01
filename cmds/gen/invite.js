/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Simple invite command.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');

module.exports = class InviteCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'invite',
      aliases: ['invite','botinvite','inviteme'],
      group: 'gen',
      memberName: 'invite',
      description: 'Links the bot invite and its main website.'
    });
  }
  async run(message) {
    message.channel.send("Interested in me? I'm flattered.\nInvite link: <https://discordapp.com/api/oauth2/authorize?client_id=675555531901108296&permissions=8&scope=bot>\nMain website: <https://ggtylerr.dev/projects/dsabot/>");
  }
}
