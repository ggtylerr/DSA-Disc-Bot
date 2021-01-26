/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Help command. Mostly based off of Commando's own built in help command.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Commando = require('discord.js-commando');
const { disambiguation } = Commando.util;
const Command = Commando.Command
const Discord = require('discord.js');

module.exports = class HelpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'help',
			group: 'gen',
			memberName: 'help',
			aliases: ['commands'],
			description: 'Displays a list of available groups, all commands in a group, or detailed information for a specified command.',
			details: 'The command may be part of a command name or a whole command name. If it isn\'t specified, all available commands will be listed.',
			examples: ['help', 'help prefix', 'help group General Commands'],
			args: [
				{
					key: 'command',
					prompt: 'Which command would you like to view the help for?',
					type: 'string',
					default: ''
				},
        {
          key: 'group',
          prompt: 'What group would you like to view the commands for?',
          type: 'string',
          default: ''
        }
			]
		});
	}

	async run(msg, args) { // eslint-disable-line complexity
		const groups = this.client.registry.groups;
		const commands = this.client.registry.findCommands(args.command, false, msg);
		const showAll = args.command && args.command.toLowerCase() === 'all';
    const showAllGroups = args.group && args.group.toLowerCase() === 'all';
    const showUsable = args.command && args.command.toLowerCase() === 'usable';
    const lGroups = this.client.registry.findGroups(args.group, false, msg);
    const showGroup = args.command && args.command.toLowerCase() === 'group';
    var embed = new Discord.MessageEmbed()
      .setColor('#3498DB')
      .setAuthor(this.client.user.username,this.client.user.avatarURL())
		if(args.command && !showAll && !showUsable && !showGroup) {
			if(commands.length === 1) {
        embed
          .setTitle(`Command ${commands[0].name}`)
          .setDescription(commands[0].description + (commands[0].guildOnly ? ' (Usable only in servers' : '') + (commands[0].nsfw ? ' (NSFW)' : ''))
          .addField('Format',msg.anyUsage(`${commands[0].name}${commands[0].format ? ` ${commands[0].format}` : ''}`));
        if(commands[0].aliases.length > 0) embed.addField('Aliases',commands[0].aliases.join(', '));
        embed.addField('Group',`${commands[0].group.name} (\`${commands[0].groupID}:${commands[0].memberName}\`)`);
        if(commands[0].details) embed.addField('Details',commands[0].details);
        if(commands[0].examples) embed.addField('Examples',commands[0].examples.join('\n'));
				try {
					msg.author.send(embed);
					if(msg.channel.type !== 'dm') msg.reply('Sent you a DM with information.');
				} catch(err) {
					msg.reply('Unable to send you the help DM. You probably have DMs disabled.');
				}
			} else if(commands.length > 15) {
				return msg.reply('Multiple commands found. Please be more specific.');
			} else if(commands.length > 1) {
				return msg.reply(disambiguation(commands, 'commands'));
			} else {
				return msg.reply(
					`Unable to identify command. Use ${msg.usage(
						null, msg.channel.type === 'dm' ? null : undefined, msg.channel.type === 'dm' ? null : undefined
					)} to view the list of all commands.`
				);
			}
		} else if (showAll || showUsable) {
			try {
        embed
          .setDescription(`To run a command in ${msg.guild ? msg.guild.name : 'any server'}, use ${Command.usage('command', msg.guild ? msg.guild.commandPrefix : null, this.client.user)}. For example, ${Command.usage('prefix', msg.guild ? msg.guild.commandPrefix : null, this.client.user)}.\nTo run a command in DMs, simply use ${Command.usage('command', null, null)} with no prefix.\nUse ${this.usage('<command>', null, null)} to view detailed information about a specific command.\nUse ${this.usage('usable', null, null)} to view a list of *usable* commands and use ${this.usage('all', null, null)} to view a list of *all* commands.\nUse ${this.usage('group <group>', null, null)} to view all commands in a group.\nUse ${this.usage('group all', null, null)} to view *all* groups.`)
          .setTitle(showAll ? 'All commands' : `Available commands in ${msg.guild || 'this DM'}`)
        groups.filter(grp => grp.commands.some(cmd => !cmd.hidden && (showAll || cmd.isUsable(msg))))
          .map(grp =>
            embed.addField(grp.name,grp.commands.filter(cmd => !cmd.hidden && (showAll || cmd.isUsable(msg))).map(cmd => `**${cmd.name}:** ${cmd.description}${cmd.nsfw ? ' (NSFW)' : ''}`).join('\n'))
        );
        embed.addField('Need help?','Join our support server: https://discord.gg/Nfkdm6vnbD');
        msg.author.send(embed);
				if(msg.channel.type !== 'dm') msg.reply('Sent you a DM with information.');
			} catch(err) {
				messages.push(await msg.reply('Unable to send you the help DM. You probably have DMs disabled.'));
			}
		} else if (showGroup && args.group && !showAllGroups) {
      if (lGroups.length === 1) {
        embed
          .setTitle(lGroups[0].name)
          .addField("Commands",lGroups[0].commands.filter(cmd => !cmd.hidden).map(cmd => `**${cmd.name}:** ${cmd.description}${cmd.nsfw ? ' (NSFW)' : ''}${cmd.isUsable(msg) ? '' : ' (Disabled on server/DM)'}`).join('\n'));
        try {
					msg.author.send(embed);
					if(msg.channel.type !== 'dm') msg.reply('Sent you a DM with information.');
				} catch(err) {
					msg.reply('Unable to send you the help DM. You probably have DMs disabled.');
				}
      } else if (lGroups.length > 15) {
        return msg.reply('Multiple groups found. Please be more specific.');
      } else if (lGroups.length > 1) {
        return msg.reply(disambiguation(lGroups, 'groups'));
      } else {
        return msg.reply(
          `Unable to identify group. Use ${msg.usage(
            null, msg.channel.type === 'dm' ? null : undefined, msg.channel.type === 'dm' ? null : undefined
          )} to view the list of all groups.`
        )
      }
    } else {
      try {
        embed
          .setDescription(`To run a command in ${msg.guild ? msg.guild.name : 'any server'}, use ${Command.usage('command', msg.guild ? msg.guild.commandPrefix : null, this.client.user)}. For example, ${Command.usage('prefix', msg.guild ? msg.guild.commandPrefix : null, this.client.user)}.\nTo run a command in DMs, simply use ${Command.usage('command', null, null)} with no prefix.\nUse ${this.usage('<command>', null, null)} to view detailed information about a specific command.\nUse ${this.usage('usable', null, null)} to view a list of *usable* commands and use ${this.usage('all', null, null)} to view a list of *all* commands.\nUse ${this.usage('group <group>', null, null)} to view all commands in a group.\nUse ${this.usage('group all', null, null)} to view *all* groups.`)
          .setTitle(showAllGroups ? 'All commands' : `Available commands in ${msg.guild || 'this DM'}`)
        groups.filter(grp => grp.commands.some(cmd => !cmd.hidden && (showAllGroups || cmd.isUsable(msg))))
          .map(grp =>
            embed.addField(grp.name,`\`${this.usage(`group ${grp.name}`, null, null)}\``,true)
        );
        embed.addField('Need help?','Join our support server: https://discord.gg/Nfkdm6vnbD');
        msg.author.send(embed);
				if(msg.channel.type !== 'dm') msg.reply('Sent you a DM with information.');
			} catch(err) {
				messages.push(await msg.reply('Unable to send you the help DM. You probably have DMs disabled.'));
			}
    }
	}
};