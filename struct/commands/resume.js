module.exports = {

    resume(msg) {
        // Comando "resume".
        const serverQueue = msg.client.queue.get(msg.guild.id);

        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();

            return msg.channel.send(`Voltando a reproduzir ${serverQueue.songs[0].title}`)
                .then(msg => console.log(`Voltando a reproduzir ${serverQueue.songs[0].title}`));
        }

        if (serverQueue && serverQueue.playing) {

            return msg.channel.send('A música já está sendo reproduzida.')
                .then(msg => console.log('A música já está sendo reproduzida.'));
        }

        msg.reply('não há nenhuma música pausada.');
        console.log('Não há nenhuma música pausada.');
    }
};
