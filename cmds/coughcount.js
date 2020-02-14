/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Cough count command. Utilizes quick.db to have server-specific cough counts.
 * 
 * ~~~developed by ggtylerr~~~
 */

const db = require('quick.db');

exports.run = (client, message, args) => {
  var id = message.channel.guild.id;

  var count = 0

  if (id === null) return;
  count = db.fetch(`cough_${id}`);
  if (count === null) message.channel.send('0');
  else message.channel.send(count);
}