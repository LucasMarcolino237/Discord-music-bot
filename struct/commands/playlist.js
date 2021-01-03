const scrapeYt = require('scrape-yt');
const { player } = require('../player');

module.exports = {
    async playlist(msg, args) {

        if (!args.length) {

            return msg.channel.send({
                embed: {
                    title: 'Endereço ou termo de busca não encontrado.',
                    description: 'nenhuma playlist foi informada.Você precisa informar o nome da playlist ou um link que leve até ela.',
                    color: 'RED',
                }
            })
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
                playing: true,
            };

            msg.client.queue.set(msg.guild.id, queueConstruct);
            serverQueue = msg.client.queue.get(msg.guild.id); 
        }

        if (!playlistPattern.test(args[0]) && videoPattern.test(args[0])) {
            return msg.channel.send({
                embed: {
                    title: 'Isso não é uma playist!',
                    description: 'utilize o comando "!play" para executar essa URL.',
                    color: 'RED',
                }
            })
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
                url: `https://www.youtube.com/watch?v=${(await video).id}`,
            };

            console.log(song);
            serverQueue.songs.push(song);
        });

        if (serverQueue.songs.length === 0) {
            
            try {

                const connection = await VoiceChannel.join();
                serverQueue.connection = connection;
                player(msg);
                
                return msg.channel.send({
                    embed: {
                        title: 'Playlist',
                        description: `${(await videos)[0].title} e ${(await playlist).videoCount - 1} outras músicas foram adicionadas a fila.`,
                        color: 'GREEN',
                    }
                });

            } catch (error) {

                console.error(`Não foi possivel entrar no canal: ${error}`);
                msg.client.queue.delete(msg.guild.id);
                await channel.leave();
                
                return msg.channel.send({
                    embed: {
                        title: 'Aviso',
                        description: `Não foi possivel entrar no canal: ${error}`,
                        color: 'RED',
                    }
                });
            } 
        }
        
        msg.channel.send({
            embed: {
                title: 'Playlist',
                description: `${await (videos)[0].title} e outras ${await (videos).length - 1} músicas foram adicionadas na fila.`,
                color: 'GREEN',
            }
        });       
    }
}