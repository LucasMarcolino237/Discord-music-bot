module.exports = {
    queue(msg) {
        // Comando "queue".
        const serverQueue = msg.client.queue.get(msg.guild.id);

        if (!serverQueue) return msg.channel.send('A fila de reprodução está vazia.')
            .then(msg => console.log('A fila de reprodução está vazia.'));
        msg.channel.send('As musicas na fila de reprodução são:');

        for (var pointer = 0; pointer < serverQueue.songs.length; pointer ++) {
            msg.channel.send(`${pointer + 1}º - ${serverQueue.songs[pointer].title}`);
        };
    }
};
