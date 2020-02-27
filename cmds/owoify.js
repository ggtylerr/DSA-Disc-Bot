/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * ~~~developed by ggtylerr~~~
 */

exports.run = (client, message, args) => {
  // Get message
  msg = args.join(' ').replace('@','*@*');

  if (msg === '') {
    message.channel.send('you need to actwuawwy gwive me a mwessage to owoify you uwu');
    return;
  }

  msg = msg.replace(/[lr]/g,"w");
  msg = msg.replace(/[LR]/g,"W");

  message.channel.send(msg);
}