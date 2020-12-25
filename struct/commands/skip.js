module.exports = {

    skip(msg) {
        // Comando "skip".
        const serverQueue = msg.client.queue.get(msg.guild.id);

        if (!serverQueue) return msg.channel.send({
            embed: {
                title: 'Aviso',
                description: 'A fila está vazia.',
                color: 'RED'
            }
        })
            .then(msg => ('Fila vazia.'));

        if (serverQueue.songs.length > 1) {
            serverQueue.connection.dispatcher.end();

            return msg.channel.send({
                embed: {
                    title: 'Skip',
                    description: 'Reproduzindo a próxima música da fila.',
                    color: 'GREEN'
                }
            })
                .then(msg => console.log('Reproduzindo a próxima música da fila.'));
        }

        serverQueue.connection.dispatcher.end();
        msg.channel.send({
            embed: {
                title: 'Fila vazia',
                description: 'Não há mais músicas na fila.',
                color: 'YELLOW'
            }
        });
        console.log('Não há mais músicas na fila.');
    }
};
