/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Random functions that *really* should be a thing in vanilla JS but apparently it isn't, so I have to make a util lib for it.
 * 
 * ~~~developed by ggtylerr~~~
 */

exports.stylize = function (a) {
  /**
   * Stylize a number by adding commas to it.
   * 
   * @param {Number} a - A number.
   */
  var b = a.toString().split('.');
  if (b[0].length >= 5) b[0] = b[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
  if (b[1] && b[1].length >= 5) b[1] = b[1].replace(/(\d{3})/g, '$1 ');
  return b.join('.');
}