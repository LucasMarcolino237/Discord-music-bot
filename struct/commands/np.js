module.exports = {

    np(msg) {
        // Comando "now playing".
        const serverQueue = msg.client.queue.get(msg.guild.id);

        if (serverQueue) {

            return msg.channel.send({
                embed: {
                    title: 'Now playing',
                    description:`Reproduzindo "${serverQueue.songs[0].title}" no momento.`,
                    color: 'YELLOW',
                    thumbnail: serverQueue.songs[0].thumbnail
                }
            });

        }

        msg.channel.send({
            embed: {
                title: 'Não há nenhuma música sendo reproduzida no momento.',
                color: 'RED'
            }
        });
    }
};
