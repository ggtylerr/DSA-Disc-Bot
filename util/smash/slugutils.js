/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Utilites for smash.gg slugs, for usage with its GraphQL API.
 * 
 * ~~~developed by ggtylerr~~~
 */

exports.convert = function (url) {
  // Converts smash.gg URLs to usable slugs
  // Split on .gg TLD
  url = url.split("gg")[1];
  // If the first character isn't /, leave as null.
  if (url.charAt(0) !== '/') return null;
  // Split through slashes
  url = url.split("/");
  url.splice(0,1);
  // Test if there's an event
  if (url[2] == 'event' && url[3] !== undefined) {
    // Return event slug
    return `${url[0]}/${url[1]}/${url[2]}/${url[3]}`;
  } else {
    // Test if it's a tournament,league, or user
    if ((url[0] == 'tournament' || url[0] == 'league' || url[0] == 'user') && url[1] !== undefined) {
      // Return appropriate slug
      return url[1];
    } else {
      // Not a usable slug
      return null;
    }
  }
}

exports.urlTest = function (url) {
  // Tests whether or not the given URL is a proper smash.gg URL.
  return /(https?:\/\/)?(www\.)?smash\.gg/.test(url);
}