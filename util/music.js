const ytdl = require('ytdl-core');

exports.playSong = function (queue, message, vc, db, id, settings) {
  vc
    .join()
    .then(connection => {
      // Create dispatcher
      const dispatcher = connection
        // Start playing song/video
        .play(
          ytdl(queue[0].url, { 
            volume: 0.1, 
            quality: settings.quality,
            highWaterMark: 1024 * 1024 * 10
          })
        )
        .on('start', () => {
          vc.dispatcher = dispatcher;
          return message.channel.send(`:musical_note: Now playing: ${queue[0].title}`);
        })
        .on('finish', c => {
          if (c !== "0") {
            db.reload();
            queue = db.getData(`/${id}/queue`);
            queue.shift();
            db.push(`/${id}/queue`,queue);
            if (queue.length >= 1) {
              db.save();
              return exports.playSong(queue, message, vc, db, id, settings);
            } else {
              db.push(`/${id}/isPlaying`,false);
              db.save();
              isPlaying = false;
              return vc.leave();
            }
          }
        })
        .on('error', e => {
          message.channel.send('Looks like there\'s an error and I can\'t play that ;(');
          return console.error(e);
        });
    })
    .catch(e => {
      return console.error(e);
    });
}