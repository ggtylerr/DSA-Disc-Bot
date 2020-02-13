/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Simple coin flip command.
 * 
 * ~~~developed by ggtylerr~~~
 */

exports.run = (client, message, args) => {
  if (Math.floor((Math.random() * 100) + 1) >= 50) message.channel.send('Heads.');
  else message.channel.send('Tails.');
}