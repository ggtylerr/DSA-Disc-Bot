/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Setting prefix command. Utilizes quick.db to set a server-specific prefix. Requires having the 'administrator' permission to use the command.
 * 
 * ~~~developed by ggtylerr~~~
 */

const db = require('quick.db');

exports.run = (client, message, args) => {
  if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You must have admin privileges to do that.');

  db.set(`prefix_${message.channel.guild.id}`, args.join(' '));
  message.channel.send('Updated!');
}