/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Simple voting command. Sends a message based on arg and adds voting reactions to it.
 * 
 * ~~~developed by ggtylerr~~~
 */

exports.run = (client, message, args) => {
  let msg = args.join(' ');
  message.channel.send('Vote on `' + msg + '`\n*(remove 1 from each reaction to get an accurate result)*')
    .then(function (message) {
      message.react("👍");
      message.react("👎");
    });
}