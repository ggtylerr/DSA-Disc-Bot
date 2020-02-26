/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Say Help command. Sends an embedded message containing all the commands. Alternative for DM'ing the user and useful for servers to make reference messages. 
 * 
 * Embed message comes from a seperate file known as help.json, which can be found in the same folder as the one this is in.
 * 
 * ~~~developed by ggtylerr~~~
 */

const fs = require('fs');

exports.run = (client, message, args) => {
  // Grab help JSON
  var embed = JSON.parse(fs.readFileSync('./cmds/help.json'));

  // Update custom values
  embed.embed.author.name = client.user.username;
  embed.embed.author.icon_url = client.user.avatarURL;
  embed.embed.description = "Set prefix for this server: " + args[args.length-1];

  // Send message
  message.channel.send(embed);
}