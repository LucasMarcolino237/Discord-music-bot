module.exports = {

    pause(msg) {
        // Comando "pause".
        const serverQueue = msg.client.queue.get(msg.guild.id);

        if (serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();

            return msg.channel.send({
                embed: {
                    description: 'Música pausada.',
                    color: 'GREEN'
                }
            })
                .then(msg => console.log('Música pausada.'));
        }

        msg.channel.send({
            embed: {
                title: 'Aviso',
                description:'é necessário que músicas estejam sendo reproduzidas para que você possa pausa-las.',
                color: 'RED'
            }
        });
        console.log('É necessário que músicas estejam sendo reproduzidas para que você possa pausa-las.');
    }
};
