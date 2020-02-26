/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Help command. DM's the user an embedded message containing all the commands. 
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

  // Send messages  
  message.author.send(embed);
  message.channel.send('Check your DMs!')
}