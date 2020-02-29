/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Commands without any prefix.
 * 
 * ~~~developed by ggtylerr~~~
 */

const JsonDB = require('node-json-db').JsonDB;
const Config = require('node-json-db/dist/lib/JsonDBConfig').Config;

var serverDB = new JsonDB(new Config(global.appRoot + "/db/serverDB",true,true,'/'));

exports.run = (client, message, args) => {
  serverDB.load();
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
    case 'cough':
      var id = message.channel.guild.id;
      function cough() {
        console.log(message.author.tag + ' coughed');
        message.channel.send('Cough');
        try {
          var coughcount = serverDB.getData(`/${id}/coughcount`) + 2;
          serverDB.push(`/${id}/coughcount`,coughcount);
        } catch {
          serverDB.push(`/${id}/coughcount`,2);
        }
      }
      try {
        var timeout = serverDB.getData(`/${id}/coughtimeout/curr`);
        var setTimeOut = serverDB.getData(`/${id}/coughtimeout/set`);
        var startTime = serverDB.getData(`/${id}/coughtimeout/time`);
        var currTime = Math.floor(Date.now() / 1000);

        // If a minute has passed since the last cough, then reset the timeout.
        if (currTime - startTime >= 60) {
          serverDB.push(`/${id}/coughtimeout/curr`,1);
          serverDB.push(`/${id}/coughtimeout/time`,currTime);
        } else {
          // Test if there's been too many coughs
          timeout += 1;
          serverDB.push(`/${id}/coughtimeout/curr`,timeout);
          if (timeout === setTimeOut) {
            var timeleft = 60 - (currTime - startTime);
            var seconds = (timeleft == 1) ? ' second' : ' seconds';
            message.channel.send('Too many coughs. Please wait ' + timeleft + seconds + ' before coughing again.');
            return;
          }
          else if (timeout > setTimeOut) return;
        }
        // Cough
        cough();
      } catch {
        // Server does not have a timeout set
        cough();
      }
      break;
  }
}