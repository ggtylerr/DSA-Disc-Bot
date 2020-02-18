/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Say Help command. Sends an embedded message containing all the commands. Alternative for DM'ing the user and useful for servers to make reference messages.
 * 
 * ~~~developed by ggtylerr~~~
 */

exports.run = (client, message, args) => {
  message.channel.send({embed: {
    color: 3447003,
    author: {
      name: client.user.username,
      icon_url: client.user.avatarURL
    },
    title: 'Here\'s the commands for this bot!',
    description: 'Set prefix for this server: ' + args[args.length-1],
    fields: [{
        name: 'General Commands',
        value: 'help: Displays this message.\nsayhelp: Displays this message, but sends it in the channel instead of DM\'ing you it.\ncount: Shows the # of msgs that has been sent since this bot existed (or 5 minutes after the count was implemented)\nrng (num): Chooses a random number from 1 thru (num)\nvote (msg): Makes a vote message.\nyorn (msg): Answers a yes/no question.\nsend (msg): Makes me send a message. @ becomes italicized to prevent pings.\nflip: Flip a coin.\nrngcase (msg): Randomize the case of a message.'
      },
      {
        name: 'Meme Commands',
        value: 'ping: Pong.\nf: Presses [F] to pay respects.\nbruh: Certifies a bruh moment.\ngeico: Save 15% or more on car insurance.\ngold: Give reddit gold.\ncoughcount: Shows the # of coughs (including the ones by the bot)\noof: OOF'
      },
      {
        name: 'Admin Only Commands',
        value: '*These commands require you to have the administrator permission on your server*\nprefix (prefix): Sets a new prefix for the server.'
      },
      {
        name: 'No Prefix',
        value: 'ayy: lmao\nowo: What\'s this?\nCough: Cough\nme2 *or* me too *or* me to: me too\nWhenever WigglesJ sends a message: me too'
      }]
  }});
}