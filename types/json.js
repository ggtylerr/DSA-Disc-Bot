/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * JSON argument type. 
 * 
 * ~~~developed by ggtylerr~~~
 */

const {ArgumentType} = require('discord.js-commando');

module.exports = class JSONArgumentType extends ArgumentType {
  constructor(client) {super(client,'json');}
  validate(val,msg,arg) {
    try {
      var o = JSON.parse(val);
      if (o && typeof o === 'object') return true;
    } catch (e) {
      return e.message;
    }
  }
  parse(val) {return JSON.parse(val);}
}