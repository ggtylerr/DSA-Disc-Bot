/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Commands without any prefix.
 * 
 * ~~~developed by ggtylerr~~~
 */

exports.run = (client, message, args) => {
  switch (message.content.toLowerCase()) {
    case 'ayy': message.channel.send('lmao'); break;
    case 'owo': message.channel.send('What\'s this?'); break;
    case 'me2':
    case 'me to':
    case 'me too':
    case 'me two':
    case 'mewtwo':
      message.channel.send('me too');
      break;
    case 'twitch.tv/ggtylerr': message.channel.send('two r\'s all lowercase'); break;
    case 'go the marcus': 
    case 'go da marcus':
      message.channel.send('go da marcus');
      break;
    case '<@!675555531901108296> help':
    case '<@!675555531901108296>':
      let help = require('./cmds/help.js');
      help.run(client,message,args);
      break;
    case 'bruh': message.channel.send('That\'s a bruh moment right there...'); break;
  }
}