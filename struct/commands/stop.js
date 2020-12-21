module.exports = {

    stop(msg) {
        // Comando "stop".
        const serverQueue = msg.client.queue.get(msg.guild.id);

        if (!serverQueue) return msg.channel.send('Não há nenhuma música tocando.')
            .then(msg => console.log('Não há músicas sendo reproduzidas.'));

        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
        msg.channel.send('Fila limpa. Encerrando o bot...');
    }
};
