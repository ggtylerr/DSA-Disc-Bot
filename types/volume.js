/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Volume argument type. 
 * 
 * ~~~developed by ggtylerr~~~
 */

const {ArgumentType} = require('discord.js-commando');

const strs = [
  "mute","silent","none",
  "half","halfway",
  "max","full"
];
const s0 = ["mute","silent","none"];
const s5 = ["half","halfway"];
const s1 = ["max","full"];

module.exports = class VolumeArgumentType extends ArgumentType {
  constructor(client) {super(client,'volume');}
  validate(val,msg,arg) {
    if (strs.includes(val.toLowerCase())) return true;
    if (val.slice(-1) == "%")
      val = val.slice(0,-1);
    const i = Number.parseInt(val);
    if (Number.isNaN(i)) return false;
		if (i < 0)
			return 'Please enter a number above or exactly 0.';
		if (i > 100)
			return 'Please enter a number below or exactly 100.';
		return true;
  }
  parse(val) {
    const lc = val.toLowerCase();
    if (lc !== undefined) {
      if (strs.includes(lc)) {
        if (s0.includes(lc)) return 0;
        else if (s5.includes(lc)) return 0.5;
        else return 1;
      }
    }
    if (val.slice(-1) == "%")
      val = val.slice(0,-1);
    return val / 100;
  }
}