/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Cough timeout command. Utilizes node-json-db to have server-specific cough timeouts.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');

const JsonDB = require('node-json-db').JsonDB;
const Config = require('node-json-db/dist/lib/JsonDBConfig').Config;

var serverDB = new JsonDB(new Config(process.env.appRoot + "/db/serverDB",false,true,'/'));

module.exports = class CoughTimeoutCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'coughtimeout',
      group: 'admin',
      memberName: 'coughtimeout',
      description: '# of coughs allowed per minute.',
      details: 'Allows (num) coughs before it times out. Resets after a minute has passed since the first cough. Setting to a negative integer will remove it. Keep in mind it only counts the user coughing, not the additional cough made by this bot in response.',
      examples: ['coughtimeout 5'],
      userPermissions: ['ADMINISTRATOR'],
      guildOnly: true,
      args: [
        {
          key: 'num',
          prompt: 'What should the number of coughs per minute be?',
          type: 'integer'
        }
      ]
    });
  }
  async run(message, args) {
    // Load database
    serverDB.load();
    var id = message.channel.guild.id;
    // Push changes
    if (parseInt[args[0]] < 0) {
      // Remove timeout if negative
      serverDB.delete(`/${id}/coughtimeout`);
    } else {
      // Set timeouts
      serverDB.push(`/${id}/coughtimeout/curr`,0);
      serverDB.push(`/${id}/coughtimeout/set`,parseInt(args[0]))
      serverDB.push(`/${id}/coughtimeout/time`,0);
    }
    // Save and send confirmation message
    serverDB.save();
    message.channel.send('Timeout updated!');
  }
}
