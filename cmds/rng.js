/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Simple RNG command. Chooses number from 1 to N.
 * 
 * ~~~developed by ggtylerr~~~
 */

exports.run = (client, message, args) => {
  let num = args[0]
  if (num) message.channel.send(Math.floor((Math.random() * num) + 1));
  else message.channel.send('That isn\'t a number.');
}