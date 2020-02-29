# DSA Discord Bot
A Discord bot made for the DSA Esports server.

Need help? [Check out the support server.](https://discord.gg/N5HnVrA)

# Commands
A command list can be DM'd to you by pinging the bot, pinging it and adding 'help', or by saying '{prefix}help' You can also do '{prefix}sayhelp' to send it to the current channel instead.

# Installation
This bot was primarily made for running on a repl.it node.js server, accompanied with express and UptimeRobot, which is easier for running it 24/7. It can also be run on any normal software after making a few adjustments.

### Setting up for repl.it
1. [Fork this repl](https://repl.it/@TylerFlowers/DSA-Disc-Bot)
2. Delete the db folder (unless you want to use the bot's database for whatever reason)
3. In index.js, you can make any adjustments you want to make, such as the default prefix. Just follow the comments.
4. [Make a new developer application on Discord Developer Portal.](https://discordapp.com/developers/applications)
5. Open the application, go to the Bot Settings, add a bot and copy the token.
6. On repl.it, make a new file named ".env"
7. In the .env file, type in "token=" and paste in your bot token.
8. Run the repl.
9. On the upper right corner, a website will show up with the current date and time. Copy its URL.
10. [On UptimeRobot,](https://uptimerobot.com/dashboard) add a new monitor.
11. Set the monitor type to HTTP(s), set the friendly name to anything you want, and set the URL to the one you copied.
12. On Discord Dev Portal, go to the app's OAuth2 settings.
13. Checkmark 'bot' and checkmark 'Administrator' (scroll down to see Administrator)
14. Copy the URL and open it.
15. Add the bot to the server you want. Make sure you're logged in to your account.
16. Done!

### Setting up for node.js
1. [Download node.js](https://nodejs.org/en/)
2. Download the repository. You can do this through here (GitHub) or through the repl (link above)
3. Extract it.
4. Delete the db folder (Unless you want to use the bot's database for whatever reason)
5. In your command prompt / terminal, do the following:

* Make sure the selected directory is the same folder as the extracted one.
* Run `npm i node-json-db`
* `npm i discord.js`
* `npm i express` *Only do this if you need to use UptimeMonitor*

6. In index.js, you can make any adjustments you want to make, such as the default prefix. Just follow the comments.
7. [Make a new developer application on Discord Developer Portal.](https://discordapp.com/developers/applications)
8. Open the application, go to the Bot Settings, add a bot and copy the token.
9. In your bot folder, make a new file named ".env"
10. In the file, type in "token=" and paste in your bot token.
11. If you didn't install express or don't want to use UptimeRobot, comment out (type // before) lines 13-20 in index.js, run `node index.js`, and skip to step 15.
12. Run the application using `node index.js` and get the URL.
13. [On UptimeRobot,](https://uptimerobot.com/dashboard) add a new monitor.
14. Set the monitor type to HTTP(s), set the friendly name to anything you want, and set the URL to the one you copied.
15. On Discord Dev Portal, go to the app's OAuth2 settings.
16. Checkmark 'bot' and checkmark 'Administrator' (scroll down to see Administrator)
17. Copy the URL and open it.
18. Add the bot to the server you want. Make sure you're logged in to your account.
19. Done!

# Licensing and Legal Disclaimers
This bot is completely public domain and can be used by anyone for any purpose. For full disclaimers, please read legal.txt.
