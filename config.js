/**
 * THIS CONFIGURATION FILE / CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * DSA Bot Configuration File
 * 
 * ~~~developed by ggtylerr~~~ 
 */

module.exports = {
// ~~~~~~~~~~~~~
//
// CONFIGURATION
//
// ~~~~~~~~~~~~~
//
// Default command prefix. Doesn't have to be one character.
DefaultPrefix: ';',
// Unknown command response.
// If set to true, the bot will send a message if it's an unknown command.
// Not recommended if it's intended for a public server or you have a bot with a similar prefix.
UnknownCommand: false,
// Debug log messages.
// If set to true, debug messages will be logged.
// Please note that this includes *every* debug log, including heartbeat messages.
// This might also print your token accidentally.
DebugLogs: false,
// Web server hosting.
// If set to true, a web server will be set up for use of Uptime Robot.
// Not recommended if you're not on repl.it.
HostWeb: true,
// Music limitations
// These are global limitations and server owners/mods can change these to a lower value
// via the 'settings' command.
// YTNoStreams: If set to true, disables livestreams.
// YTDuration : If set to anything but -1, it will only allow that amount of hours per video.
//              (Setting it to 1 will only allow up to 1 hour, 2 for 2 hours, etc.)
// YTQuality  : Quality of audio. either 'highest' or 'lowest'
// MQueueLimit: Amount of songs/videos allowed in a queue. Limit disabled if set to -1.
YTNoStreams: false,
YTDuration : -1,
YTQuality  : 'highestaudio',
MQueueLimit: -1,
//
// ~~~~~~~~~~~~~
//
//    END OF
// CONFIGURATION
//
// ~~~~~~~~~~~~~
}