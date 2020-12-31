const ytdl = require('ytdl-core');

module.exports = {

    async play(msg, song) {
        const serverQueue = msg.client.queue.get(msg.guild.id);

        if (!song) {
            serverQueue.voiceChannel.leave();
            msg.client.queue.delete(msg.guild.id);
            return;
        }

        const dispatcher = serverQueue.connection.play(ytdl(song.url))
            .on('finish', () => {
                serverQueue.songs.shift();
                play(msg, serverQueue.songs[0]);
            })
            .on('error', error => console.error(error));
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        serverQueue.textChannel.send({
            embed: {
                title: 'Play',
                description: `Tocando ${song.title}`,
                color: 'GREEN',
            }});
    }
}