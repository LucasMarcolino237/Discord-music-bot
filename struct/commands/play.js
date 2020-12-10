const ytdl = require('ytdl-core');
const scrapeYt = require("scrape-yt");

module.exports = {
    async play(msg, args) {
        // Comando "play". 
        if (!args.length) {

            return msg.channel.send('Nenhuma música foi informada.Você precisa informar o nome da música ou um link que leve até ela.')
                .then(msg => console.log('Comando incompleto. Nenhuma música foi informada.'));
        }

        let search = args.join(' ');
    
        const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
        const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;

        const VoiceChannel = msg.member.voice.channel;
        const serverQueue = msg.client.queue.get(msg.guild.id);

        if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
            return msg.reply('Utilize o comando "!playlist" para executar essa URL.')
        }

        
        // https://www.npmjs.com/package/scrape-yt
        const video = (async() => {
        let videos = await scrapeYt.search(search, {
            type: 'video'
        });
        console.log(videos[0]);
        return videos[0]
        })();
        
        
        console.log(video);
        const song = {
            id: (await video).id,
            title: (await video).title,
            url: `https://www.youtube.com/watch?v=${(await video).id}`
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
    }
};
