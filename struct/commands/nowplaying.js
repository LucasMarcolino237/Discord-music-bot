module.exports = {

    nowplaying(msg) {
        // Comando "now playing".
        const serverQueue = msg.client.queue.get(msg.guild.id);

        if (serverQueue.playing) {

            return msg.channel.send(`Reproduzindo "${serverQueue.songs[0].title}" no momento.`);
        }

        msg.channel.send('Não há nenhuma música sendo reproduzida no momento.');
    }
};
