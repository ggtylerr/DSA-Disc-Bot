/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Randomize case command. Randomizes the case (between upper and lower case) of a message given.
 * 
 * ~~~developed by ggtylerr~~~
 */

exports.run = (client, message, args) => {
  let msg = args.join(' ');
  var newmsg = "";
  for (var i = 0; i < msg.length; i++) {
    if (Math.floor((Math.random() * 100) + 1) >= 50) newmsg += msg.charAt(i).toLowerCase();
    else newmsg += msg.charAt(i).toUpperCase();
  }
  message.channel.send(newmsg);
}