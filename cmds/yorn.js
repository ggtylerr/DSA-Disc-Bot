/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Simple yes or no command. Chooses from 1 to 100. If it's over 50, it returns Yes. If it's not, it returns No.
 * 
 * ~~~developed by ggtylerr~~~
 */

exports.run = (client, message, args) => {
  if (Math.floor((Math.random() * 100) + 1) >= 50) message.channel.send('Yes.');
  else message.channel.send('No.');
}