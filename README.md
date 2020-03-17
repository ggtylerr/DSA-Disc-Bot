# DSA Discord Bot
A Discord bot originally made for the DSA Esports server, which is now being made as a general-purpose / esports discord bot.

Need help? [Check out the support server.](https://discord.gg/N5HnVrA)

# Commands
A command list can be DM'd to you by pinging it and adding 'help' or by saying '{prefix}help'. You can also do '{prefix}sayhelp' to send it to the current channel instead.

# Installation
This bot was primarily made for running on a repl.it node.js server, accompanied with express and UptimeRobot, which is easier for running it 24/7. It can also be run on any normal software after making a few adjustments.

### Setting up for repl.it

Getting the actual bot
1. [Fork this repl](https://repl.it/@TylerFlowers/DSA-Disc-Bot)
2. Delete the db folder (unless you want to use the bot's database for whatever reason)
3. In index.js, you can make any adjustments you want to make, such as the default prefix. Just follow the comments.

Making the discord bot user and adding it
1. [Make a new developer application on Discord Developer Portal.](https://discordapp.com/developers/applications)
2. Open the application, go to the Bot Settings and add a bot.
3. Go to the OAuth2 settings.
4. Checkmark 'Bot', scroll down, and checkmark 'Administrator'
5. Copy the URL and open it.
6. Add the bot to the server you want. Make sure you're logged in to your account.

Configuring and running the bot
1. On repl.it, make a new file named ".env"
2. In the Discord Developer Portal, go to the bot settings and copy the token.
3. In the .env file, type in "token=" and paste in your bot token.
4. In Discord, copy the bot's ID by right clicking on it and selecting 'Copy ID'. If you don't see that option, go to the Appearance settings and enable 'Developer Mode'
5. Back in the file, make a new line, type in "id=" and paste in your ID.
6. Run the repl.
7. You're done! (At least, if you don't want UptimeRobot)

Configuring UptimeRobot
1. On the upper right corner, a website will show up with the current date and time. Copy its URL.
2. [On UptimeRobot,](https://uptimerobot.com/dashboard) add a new monitor.
3. Set the monitor type to HTTP(s), set the friendly name to anything you want, and set the URL to the one you copied.
4. Andd now you're done!

### Setting up for node.js
Getting the actual bot
1. [Download node.js](https://nodejs.org/en/)
2. Download the repository. You can do this through here (GitHub) or through the repl (link above)
3. Extract it.
4. Delete the db folder (Unless you want to use the bot's database for whatever reason)
5. In your command prompt / terminal, make sure the selected directory is the same folder as the extracted one and run `npm install`
6. In index.js, you can make any adjustments you want to make, such as the default prefix. Just follow the comments.

Making the discord bot user and adding it
1. [Make a new developer application on Discord Developer Portal.](https://discordapp.com/developers/applications)
2. Open the application, go to the Bot Settings and add a bot.
3. Go to the OAuth2 settings.
4. Checkmark 'Bot', scroll down, and checkmark 'Administrator'
5. Copy the URL and open it.
6. Add the bot to the server you want. Make sure you're logged in to your account.

Configuring and running the bot
1. In your bot folder, make a new file named ".env"
2. In the Discord Developer Portal, go to the bot settings and copy the token.
3. In the .env file, type in "token=" and paste in your bot token.
4. In Discord, copy the bot's ID by right clicking on it and selecting 'Copy ID'. If you don't see that option, go to the Appearance settings and enable 'Developer Mode'
5. Back in the file, make a new line, type in "id=" and paste in your ID.
6. Run the application using `node index.js` in your command prompt/terminal.
7. You're done! (At least, if you don't want UptimeRobot)

Configuring UptimeRobot
1. Get the URL.
2. [On UptimeRobot,](https://uptimerobot.com/dashboard) add a new monitor.
3. Set the monitor type to HTTP(s), set the friendly name to anything you want, and set the URL to the one you copied.
4. Andd now you're done!

# Licensing and Legal Disclaimers
This bot is completely public domain and can be used by anyone for any purpose. For full disclaimers, please read legal.txt.
