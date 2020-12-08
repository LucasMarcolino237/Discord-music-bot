module.exports = {

    skip(msg) {
        // Comando "skip".
        const serverQueue = msg.client.queue.get(msg.guild.id);

        if (!serverQueue) return msg.channel.send('A fila está vazia.')
            .then(msg => ('Fila vazia.'));

        if (serverQueue.songs.length > 1) {
            serverQueue.connection.dispatcher.end();

            return msg.channel.send('Reproduzindo a próxima música da fila.')
                .then(msg => console.log('Reproduzindo a próxima música da fila.'));
        }

        serverQueue.connection.dispatcher.end();
        msg.channel.send('Não há mais músicas na fila.');
        console.log('Não há mais músicas na fila.');
    }
};
