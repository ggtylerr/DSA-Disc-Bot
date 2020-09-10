# DSA Discord Bot
A Discord bot originally made for the DSA Esports server, which is now being made as a general-purpose / esports discord bot.

Need help? [Check out the support server.](https://discord.gg/N5HnVrA)

[Roadmap](https://trello.com/b/1nwmnqVx/dsa-bot-roadmap)

# Commands
A command list can be DM'd to you by pinging it and adding 'help' or by saying '{prefix}help'. You can also do '{prefix}sayhelp' to send it to the current channel instead.

Alternatively, [an online command list is available.](http://ggtylerr.digital/projects/dsabot/commands)

# Installation
This bot was primarily made for running on a repl.it node.js server, accompanied with express and UptimeRobot, which is easier for running it 24/7. It can also be run on any normal software after making a few adjustments.

Please note that, at this time, the main focus is on the actual bot itself. This makes the process of forking it and running a custom version pretty tedious. At this time, if you want to run your own version, you're best off forking the repl and setting it up on repl.it.

There are plans to improve the installation process, but as of right now, no efforts are being made.

### Getting the bot on repl.it
1. [Fork this repl](https://repl.it/@TylerFlowers/DSA-Disc-Bot)
2. In index.js, you can make any adjustments you want to make, such as the default prefix. Just follow the comments.
3. Skip the next section and go straight to the rest of the installation process.

### Getting the bot on node.js
1. [Download node.js](https://nodejs.org/en/)
2. Download the repository. You can do this through here (GitHub) or through the repl (link above)
3. Extract it.
4. In your command prompt / terminal, make sure the selected directory is the same folder as the extracted one and run `npm install`
5. In index.js, you can make any adjustments you want to make, such as the default prefix. Just follow the comments.

### The rest of the installation process
#### Making the discord bot user and adding it
1. [Make a new developer application on Discord Developer Portal.](https://discordapp.com/developers/applications)
2. Open the application, go to the Bot Settings and add a bot.
3. Configure any settings you want.

#### Configuring Discord info
1. On repl.it/your bot folder, make a new file named ".env"
2. In the Discord Developer Portal, go to the bot settings and copy the token.
3. In the .env file, type in "token=" and paste in your bot token.
<<<<<<< HEAD
4. In Discord, copy your ID (or whoever you want to specify as the owner) by right clicking on it and selecting 'Copy ID'. If you don't see that option, go to the Appearance settings and enable 'Developer Mode'
5. Back in the file, make a new line, type in "id=" and paste in the ID.
6. Your .env file should now look like this:
```
token="bottoken"
id="ownerid"
```

#### Adding Challonge and smash.gg API keys
*Challonge and smash.gg require API keys for commands that don't require them or don't do actions requiring an account (i.e. challongematches or smashggtourney)*
**_You may skip this section if you aren't using this bot for esports purposes, but some commands will not function if you do._**
1. On Challonge, log in and [copy your API key.](https://challonge.com/settings/developer)
2. In .env, make a new line, type in "challongeapi=" and paste in your API key.
3. On smash.gg, log in and [go to your developer settings.](https://smash.gg/admin/user/a4829083/developer)
4. Create a new token and set the description to something you can remember later (e.g. "Discord Bot")
5. Copy down the token somewhere safe. Smash.gg does not let you view it again, and if you lose it, you'll have to make a new one.
6. In .env, make a new line, type in "smashggapi=" and paste in your token.
7. The file should now look like this:
```
token="bottoken"
id="botid"
challongeapi="challongeapikey"
smashggapi="smashggtoken"
```

#### Running it, finally
1. If you're on repl.it, press the Run button.
2. If you're on node.js, run `node index.js` in your command prompt/terminal (make sure the current directory is the same one as the bot's directory)
3. You're done! (At least, if you don't want UptimeRobot)

#### Configuring UptimeRobot
1. On the upper right corner, a website will show up with the current date and time. Copy its URL.
2. [On UptimeRobot,](https://uptimerobot.com/dashboard) add a new monitor.
3. Set the monitor type to HTTP(s), set the friendly name to anything you want, and set the URL to the one you copied.
4. Anddd now you're done!

# Licensing and Legal Disclaimers
This bot is completely public domain and can be used by anyone for any purpose. For full disclaimers, please read legal.txt.
