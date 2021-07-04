/**
 * THIS SETTINGS FILE / CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * DSA Bot Settings File
 * 
 * ~~~developed by ggtylerr~~~ 
 */

const Config = require('../config');

exports.Settings = {
  YTNoStreams: {
    title: 'No Livestreams',
    description: "If set to true, disables livestreams.",
    max: Config.YTNoStreams,
    type: 'boolean',
    perm: ['PRIORITY_SPEAKER']
  },
  YTDuration: {
    title: 'Max Duration (in hours)',
    description: "If set to anything but -1, it will only allow that amount of hours per video.\n(Setting it to 1 will only allow up to 1 hour, 2 for 2 hours, etc.)",
    max: Config.YTDuration,
    type: 'toggleinteger',
    perm: ['PRIORITY_SPEAKER']
  },
  YTQuality: {
    title: 'Audio Quality',
    description: "Quality of audio, either 'highest' or 'lowest'",
    max: Config.YTQuality,
    type: 'ytdl',
    perm: ['PRIORITY_SPEAKER']
  },
  MQueueLimit: {
    title: "Max amount in music queue",
    description: "Amount of songs/videos allowed in the music queue. Limit disabled if set to -1.",
    max: Config.MQueueLimit,
    type: 'toggleinteger',
    perm: ['PRIORITY_SPEAKER']
  },
  SmashGGQueueAdmin: {
    title: "smash.gg admin-only queue",
    description: "Sets the queue to only be able to be changed by admins.",
    type: 'boolean'
  }
}