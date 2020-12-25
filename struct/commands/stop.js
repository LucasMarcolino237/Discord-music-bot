module.exports = {

    stop(msg) {
        // Comando "stop".
        const serverQueue = msg.client.queue.get(msg.guild.id);

        if (!serverQueue) return msg.channel.send({
            embed: {
                title: 'Aviso',
                description: 'Não há nenhuma música tocando.',
                color: 'RED'
            }
        })
            .then(msg => console.log('Não há músicas sendo reproduzidas.'));

        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
        msg.channel.send({
            embed: {
                title: 'Fila limpa.',
                description: 'Encerrando o bot...',
                color: 'YELLOW'
            }
        } );
    }
};
