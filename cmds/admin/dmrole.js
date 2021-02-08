/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * DM role command. DMs a message to anyone with a certain role in a server.
 * 
 * (Note: The command 'optoutdm' is necessary if you want to use any commands involving user sending DMs, including this one, as it is required by top.gg and a number of other bot list sites.)
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');
const Discord = require('discord.js');

const JsonDB = require('node-json-db').JsonDB;
const Config = require('node-json-db/dist/lib/JsonDBConfig').Config;

var serverDB = new JsonDB(new Config(process.env.appRoot + "/db/serverDB",false,true,'/'));

module.exports = class InviteCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'dmrole',
      aliases: ['dmroles','msgrole','msgroles'],
      group: 'admin',
      memberName: 'dmrole',
      description: 'DMs a message to anyone with that role in a server.',
      details: 'You need the "Mention Everyone" permission in order to run this command.',
      userPermissions: ['MENTION_EVERYONE'],
      guildOnly: true,
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
    // Ready up opt-out array
    await serverDB.reload();
    var arr = [];
    try {
      arr = serverDB.getData(`/${message.channel.guild.id}/optoutdm`);
    } catch (e) {
      // Assuming nobody opted out, carry on
    }
    // Send DM
    message.guild.roles.fetch(role.id)
      .then(roles => 
        roles.members.each(user => {
          if (arr.indexOf(user.user.id) === -1) {
            user.user.send(embed);
          }
        })
      )
      .catch(console.error);
  }
}
