/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * DM role command. DMs a message to anyone with a certain role in a server.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');
const Discord = require('discord.js');

module.exports = class InviteCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'dmrole',
      aliases: ['dmroles','msgrole','msgroles'],
      group: 'gen',
      memberName: 'dmrole',
      description: 'DMs a message to anyone with that role in a server.',
      details: 'You need the "Mention Everyone" permission in order to run this command.',
      userPermissions: ['MENTION_EVERYONE'],
      args: [
        {
          key: 'role',
          type: 'role',
          prompt: 'What role do you want to DM?'
        },
        {
          key: 'msg',
          type: 'string',
          prompt: 'What message do you want to send?'
        }
      ]
    });
  }
  async run(message, {role,msg}) {
    // Fetch members to check for cache (if they have more than 250 members)
    if (message.guild.memberCount > 249)
      message.guild.fetchMembers();
    // Make a special embed
    const embed = new Discord.MessageEmbed()
      .setColor(role.color)
      .setTitle("New message from " + message.guild.name)
      .setAuthor(message.author.username,message.author.avatarURL())
      .setDescription(msg);
    // Send DM
    message.guild.roles.fetch(role.id)
      .then(roles => 
        roles.members.each(user => user.user.send(embed))
      )
      .catch(console.error);
  }
}
