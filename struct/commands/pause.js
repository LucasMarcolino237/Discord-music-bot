module.exports = {

    pause(msg) {
        // Comando "pause".
        const serverQueue = msg.client.queue.get(msg.guild.id);

        if (serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();

            return msg.channel.send('Música pausada.')
                .then(msg => console.log('Música pausada.'));
        }

        msg.channel.send('É necessário que músicas estejam sendo reproduzidas para que você possa pausa-las.');
        console.log('É necessário que músicas estejam sendo reproduzidas para que você possa pausa-las.');
    }
};
