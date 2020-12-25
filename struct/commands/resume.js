module.exports = {

    resume(msg) {
        // Comando "resume".
        const serverQueue = msg.client.queue.get(msg.guild.id);

        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();

            return msg.channel.send({
                embed: {
                    title: 'Resume',
                    description: `Voltando a reproduzir ${serverQueue.songs[0].title}`,
                    color: 'GREEN'
                }
            })
                .then(msg => console.log(`Voltando a reproduzir ${serverQueue.songs[0].title}`));
        }

        if (serverQueue && serverQueue.playing) {

            return msg.channel.send({
                embed: {
                    title: 'Aviso',
                    description: 'A música já está sendo reproduzida.',
                    color: 'RED'
                }
            })
                .then(msg => console.log('A música já está sendo reproduzida.'));
        }

        msg.channel.send({
            embed: {
                title: 'Aviso',
                description: 'Não há nenhuma música pausada.',
                color: 'RED'
            }
        });
        console.log('Não há nenhuma música pausada.');
    }
};
