/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Simple sending command. Italicizes @ to prevent pings.
 * 
 * ~~~developed by ggtylerr~~~
 */

exports.run = (client, message, args) => {
  let msg = args.join(' ').replace('@','*@*');
  message.delete();
  if (msg == '') message.channel.send('*** ***');
  else message.channel.send(msg);
}