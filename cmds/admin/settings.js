/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Settings command. Utilizes a separate file (util/settings.js) to set default variables and their info, and node-json-db to set certain variables used by other commands.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');

const JsonDB = require('node-json-db').JsonDB;
const Config = require('node-json-db/dist/lib/JsonDBConfig').Config;

var serverDB = new JsonDB(new Config(process.env.appRoot + "/db/serverDB",false,true,'/'));

const { Settings } = require('../../util/settings');

const { MessageEmbed } = require('discord.js');
const Pagination = require('discord-paginationembed');

const { types } = require('../../util/chktype');

module.exports = class SettingsCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'settings',
      aliases: ['set'],
      group: 'admin',
      memberName: 'settings',
      description: 'Either view or set settings on this server',
      guildOnly: true,
      args: [
        {
          key: 'setting',
          prompt: 'What setting do you want to change?',
          type: 'string',
          default: ''
        },
        {
          key: 'value',
          prompt: 'What do you want to change this setting to?',
          type: 'string',
          default: ''
        }
      ]
    });
  }
  async run(message, args) {
    // Load database
    serverDB.reload();
    // Show list of commands if no arguments given
    if (args.setting == '' && args.value == '')
      return showList(message,serverDB);
    // Show setting if no value
    if (args.value == '')
      return showSetting(message,serverDB,args.setting);
    // Check if user has permission
    const s = Settings[args.setting];
    var perm = ['ADMINISTRATOR'];
    if (s.perm == null) perm = s.perm;
    for (var i = 0; i < perm.length; i++)
      if(!message.guild.member(message.author).hasPermission(perm[i]))
        return message.channel.send(`You don\'t have the permission needed to change this setting!
        (Specifically ${perm[i].toLowerCase()}. for a list of permissions needed, do \`settings ${args.setting}\`)`);
    // Validate and parse value
    var value = args.value;
    const t = types[s.type];
    if (!(s.type == null)) {
      if (t.validate(value))
        value = t.parse(value);
      else return message.channel.send(`Invalid value! Needs to be the same format as ${s.type}.`);
    }
    // Check for max value
    if (t.max(value,s.max))
      return message.channel.send(`Over the max value, \`${s.max}\`! Set it to a value lower than this.`);
    // Save setting
    serverDB.push(`/${message.guild.id}/settings/${args.setting}`,value);
    serverDB.save();
    // Say that the setting is saved
    return message.channel.send(`Done! \`${args.setting}\` set as \`${value}\``);
  }
}

function showList(msg,db) {
  // Generate embeds
  const embeds = [];
  const keys = Object.keys(Settings);
  for (let i = 0; i < keys.length; i += 9) {
    const embed = new MessageEmbed()
      .setFooter(`Page ${Math.floor(i/9)+1}/${Math.floor(keys.length/9)+1}`);
    for (let j = i; j < Math.min(i+9,keys.length); j++) {
      var c = Settings[keys[j]];
      var v = "N/A";
      try {
        v = db.getData(`/${message.channel.guild.id}/settings/${c}`);
      } catch (e) {
        // assume setting is not set yet and move on
      }
      embed.addField(
        c.title,
        `${c.description}\n
        Name: \`${keys[j]}\`
        ${(!(c.max == null)) ? `Max value allowed: ${c.max}\n` : ''}Currently set as: ${v}`,true);
    }
    embeds.push(embed);
  }
  // Compile and build pagination embed
  new Pagination.Embeds()
    .setArray(embeds)
    .setChannel(msg.channel)
    .setColor('#FF8800')
    .setTitle('Settings in server')
  .build();
}

function showSetting(msg,db,setting) {
  const s = Settings[setting];
  var v = "N/A";
  try {
    v = db.getData(`/${message.channel.guild.id}/settings/${setting}`);
  } catch (e) {
    // assume setting is not set yet and move on
  }
  let info = `Name: \`${setting}\`
    Use by doing \`settings ${setting} (value)\``;
  info += (!(v === "N/A")) ? `\nCurrent set as ${v}` : '';
  info += (!(s.max == null)) ? `\nMax value allowed: ${s.max}` : '';
  info += (!(s.perm == null)) ? `\nPermissions required: ${s.perm}` : '';
  info += `\nType: ${s.type}`;
  return msg.channel.send(new MessageEmbed()
    .setTitle(s.title)
    .setDescription(s.description)
    .setColor('#FF8800')
    .addField('Additional info',info)
  );
}