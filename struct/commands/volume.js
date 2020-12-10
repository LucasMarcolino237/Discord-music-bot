module.exports = {
    
    volume(msg, args) {

        const channel = msg.member.voice.channel;
        const serverQueue = msg.client.queue.get(msg.guild.id);

        if (!serverQueue) {
            return msg.channel.send('Esse comando só pode ser usado enquanto uma música é reproduzida.');
        }

        if (!args[0]) {
            return msg.channel.send('Volume atual: ' + serverQueue.volume);
        }

        if (args[0] > 10) {
            msg.channel.send('Nos vemos no céu amigo... :grin:');
        }

        serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0]/5);
        serverQueue.volume = args[0];

        msg.channel.send('Volume atualizado para: ' + args[0]);
    }
}