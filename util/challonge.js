/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * Asynchronous versions of Challonge's API methods that allows for await functionality.
 * 
 * ~~~developed by ggtylerr~~~
 */

exports.getPlayerName = async function(client,match,id) {
  return new Promise(
    (resolve,reject) => {
      client.participants.show({
        id: match,
        participantId: id,
        callback: (err,data) => {
          if (err) resolve('N/A');
          else {
            if (data.participant === undefined) resolve('N/A');
            else resolve(data.participant.name);
          }
        }
      })
    }
  )
}
exports.getMatch = async function(client,id) {
  return new Promise(
    (resolve,reject) => {
      client.matches.index({
        id: id,
        callback: (err,data) => {
          if (err) reject(err);
          else resolve(data);
        }
      })
    }
  )
}
exports.getTourneys = async function(client) {
  return new Promise(
    (resolve,reject) => {
      client.tournaments.index({
        callback: (err,data) => {
          if (err) reject(err);
          else resolve(data);
        }
      })
    }
  )
}