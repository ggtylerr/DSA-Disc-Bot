/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Cough meme command. Utilizes JsonDB to make server-specific timeouts and counts.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');

const JsonDB = require('node-json-db').JsonDB;
const Config = require('node-json-db/dist/lib/JsonDBConfig').Config;

var serverDB = new JsonDB(new Config(global.appRoot + "/db/serverDB",true,true,'/'));

module.exports = class CoughCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'cough',
      group: 'nopre',
      memberName: 'cough',
      description: 'Cough',
      patterns: [/^cough$/gi]
    });
  }
  async run(message) {
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
        if (timeout === setTimeOut) {
          var timeleft = 60 - (currTime - startTime);
          var seconds = (timeleft == 1) ? ' second' : ' seconds';
          message.channel.send('Too many coughs. Please wait ' + timeleft + seconds + ' before coughing again.');
          return;
        }
        else if (timeout > setTimeOut) return;
        else serverDB.push(`/${id}/coughtimeout/curr`,timeout);
      }
      // Cough
      cough();
    } catch {
      // Server does not have a timeout set
      cough();
    }
  }
}
