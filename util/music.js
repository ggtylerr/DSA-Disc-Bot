const ytdl = require('ytdl-core');

exports.playSong = function (queue, message, vc, db, id, settings) {
  vc
    .join()
    .then(connection => {
      // Create stream
      const stream = ytdl(queue[0].url, {
        requestOptions: {
          headers: {
            Cookie: process.env.ytcookie
          }
        },
        volume: 0.1, 
        quality: settings.quality,
        highWaterMark: 1024 * 1024 * 10
      })
      // Create dispatcher
      const dispatcher = connection
        // Start playing song/video
        .play(stream)
        .on('start', () => {
          vc.dispatcher = dispatcher;
          vc.np = stream;
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
          message.channel.send(`Looks like there's an error and I can't play that ;(\`\`\`${e}\`\`\``);
          console.error(e);
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
        });
    })
    .catch(e => {
      return console.error(e);
    });
}