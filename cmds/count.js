/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Message count command. Utilizes quick.db to have server-specific message counts.
 * 
 * ~~~developed by ggtylerr~~~
 */

const db = require('quick.db');

exports.run = (client, message, args) => {
  var id = message.channel.guild.id;

  var count = 0

  if (id === null) return;
  count = db.fetch(`count_${id}`);
  if (count === null) message.channel.send('Couldn\'t get the count from our database. This probably only happens if nobody has said anything since the bot joined (excluding other bots). Since you said something, just wait around a minute before it automatically updates.\n*(If you believe this is a bug, please DM @\\\\GGTyler\\\\#8605*)');
  else message.channel.send(count);
}