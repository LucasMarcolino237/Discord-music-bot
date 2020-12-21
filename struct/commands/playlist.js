const scrapeYt = require('scrape-yt');
const ytdl = require('ytdl-core');

module.exports = {
    async playlist(msg, args) {

        if (!args.length) {

            return msg.reply('nenhuma playlist foi informada.Você precisa informar o nome da música ou um link que leve até ela.')
                .then(msg => console.log('Comando incompleto. Nenhuma playlist foi informada.'));
        }

        let search = args.join(' ');

        const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
        const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;

        const VoiceChannel = msg.member.voice.channel;
        let serverQueue = msg.client.queue.get(msg.guild.id);

        if (!serverQueue){
            const queueConstruct = {
                textChannel: msg.channel,
                voiceChannel: VoiceChannel,
                connection: null,
                songs: [],
                volume: 2,
                playing: true
            };

            msg.client.queue.set(msg.guild.id, queueConstruct);
            serverQueue = msg.client.queue.get(msg.guild.id); 
        }

        if (!playlistPattern.test(args[0]) && videoPattern.test(args[0])) {
            return msg.reply('utilize o comando "!play" para executar essa URL.')
        }

        const play = async song => {

            if (!song) {
                serverQueue.voiceChannel.leave();
                msg.client.queue.delete(msg.guild.id);
                return;
            }

        const dispatcher = serverQueue.connection.play(ytdl(song.url))
            .on('finish', () => {
                serverQueue.songs.shift();
                play(serverQueue.songs[0]);
            })
            .on('error', error => console.error(error));
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        serverQueue.textChannel.send(`Tocando ${song.title}`);
        }

        
        // https://www.npmjs.com/package/scrape-yt
        const playlist = (async() => {
            let playlists = await scrapeYt.search(search, {
                type: 'playlist'
            });
            console.log(playlists[0]);
            return playlists[0]
        })();

        const playlistId = (await playlist).id
        const videos = (await scrapeYt.getPlaylist(playlistId)).videos;

        videos.forEach( async video => {
            const song = {
                id: (await video).id,
                title: (await video).title,
                url: `https://www.youtube.com/watch?v=${(await video).id}`
            };

            console.log(song)
            if (serverQueue) {
                serverQueue.songs.push(song)
            }
        });

        try {
            if(serverQueue.songs.length !== 0) {
                return msg.channel.send(`\n${(await videos)[0].title} e ${(await playlist).videoCount - 1} outras músicas foram adicionadas a fila.`);
            }

            const connection = await VoiceChannel.join();
            serverQueue.connection = connection;
            play(serverQueue.songs[0]);
            
            return msg.channel.send(`\n${(await videos)[0].title} e ${(await playlist).videoCount - 1} outras músicas foram adicionadas a fila.`);

        } catch (error) {

            console.error(`Não foi possivel entrar no canal: ${error}`);
            msg.client.queue.delete(msg.guild.id);
            await channel.leave();

            return msg.channel.send(`Não foi possivel entrar no canal: ${error}`);
        }        
    }
}