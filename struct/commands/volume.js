module.exports = {
    
    volume(msg, args) {

        const serverQueue = msg.client.queue.get(msg.guild.id);

        if (!serverQueue) {
            return msg.channel.send({
                embed: {
                    title: 'Aviso',
                    description: 'Esse comando só pode ser usado enquanto uma música é reproduzida.',
                    color: 'RED'
                }
            });
        }

        if (!args[0]) {
            return msg.channel.send({
                embed: {
                    title: 'Volume atual:',
                    description: serverQueue.volume,
                    color: 'BLUE'
                }
            });
        }

        if (args[0] > 10) {
            msg.channel.send({
                embed: {
                    title: 'É...',
                    description: 'Nos vemos no céu amigo... :grin:'
                }
            });
        }

        serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0]/5);
        serverQueue.volume = args[0];

        msg.channel.send({
            embed: {
                title: 'Volume atualizado para:',
                description: args[0],
                color: 'BLUE'
            }
        });
    }
}