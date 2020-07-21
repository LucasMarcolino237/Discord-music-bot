const { Util } = require('discord.js')
const ytdl = require('ytdl-core');

module.exports = {

    async play(msg, args) {
        // Comando "play". 
        if (!args[0]) {
            return msg.channel.send('Nenhuma música foi informada.Você precisa informar o nome da música ou um link que leve até ela.')
                .then(msg => console.log('Comando incompleto. Nenhuma música foi informada.'));
        }
        const VoiceChannel = msg.member.voice.channel;
        const serverQueue = msg.client.queue.get(msg.guild.id);
        const songInfo = await ytdl.getInfo(args[0].replace(/<(.+)>/g, '$1'));
        const song = {
            id: songInfo.video_id,
            title: Util.escapeMarkdown(songInfo.title),
            url: songInfo.video_url
        };
        const queueConstruct = {
            textChannel: msg.channel,
            voiceChannel: VoiceChannel,
            connection: null,
            songs: [],
            volume: 2,
            playing: true
        };
        const play = async song => {
            const queue = msg.client.queue.get(msg.guild.id);
            if (!song) {
                queue.voiceChannel.leave();
                msg.client.queue.delete(msg.guild.id);
                return;
            }
        const dispatcher = queue.connection.play(ytdl(song.url))
            .on('finish', () => {
                queue.songs.shift();
                play(queue.songs[0]);
            })
            .on('error', error => console.error(error));
        dispatcher.setVolumeLogarithmic(queue.volume / 5);
        queue.textChannel.send(`Tocando ${song.title}`);
    }
        if (serverQueue) {
            serverQueue.songs.push(song);
            console.log(serverQueue.songs);
            return msg.channel.send(`${song.title} foi adicionado a fila.`);
        }
        msg.client.queue.set(msg.guild.id, queueConstruct);
        queueConstruct.songs.push(song);
        try {
            const connection = await VoiceChannel.join();
            queueConstruct.connection = connection;
            play(queueConstruct.songs[0]);
        } catch (error) {
            console.error(`Não foi possivel entrar no canal: ${error}`);
            msg.client.queue.delete(msg.guild.id);
            await channel.leave();
            return msg.channel.send(`Não foi possivel entrar no canal: ${error}`);
        }
    },


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
    },


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
        msg.channel.send('Não há nenhuma música pausada.');
        console.log('Não há nenhuma música pausada.');
    },


    skip(msg) {
        // Comando "skip".
        const serverQueue = msg.client.queue.get(msg.guild.id);
        if (!serverQueue) return msg.channel.send('A fila está vazia.')
            .then(msg => ('Fila vazia.'));
        if (serverQueue.songs.length > 1) {
            serverQueue.connection.dispatcher.end();
            return msg.channel.send('Reproduzindo a próxima música da fila.')
                .then(msg => console.log('Reproduzindo a próxima música da fila.'));
        }
        serverQueue.connection.dispatcher.end();
        msg.channel.send('Não há mais músicas na fila.');
        console.log('Não há mais músicas na fila.');
    },


    stop(msg) {
        // Comando "stop".
        const serverQueue = msg.client.queue.get(msg.guild.id);
        if (!serverQueue) return msg.channel.send('Não há nenhuma música tocando.')
            .then(msg => console.log('Não há músicas sendo reproduzidas.'));
        serverQueue.songs = []
        serverQueue.connection.dispatcher.end();
        msg.channel.send('Comando "stop" usado.');
        console.log('Comando "stop" usado.');
    },


    leave(msg) {
        // Comando "leave".
        const VoiceChannel = msg.member.voice.channel;
        console.log('Saindo do canal.');
        VoiceChannel.leave();
    }
};
