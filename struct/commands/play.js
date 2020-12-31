const scrapeYt = require("scrape-yt");
const { play } = require('../player')

module.exports = {
    async play(msg, args) {
        // Comando "play". 
        if (!args.length) {

            return msg.channel.send({
                embed: {
                    title: 'Endereço ou termo de busca não encontrado.',
                    description: 'nenhuma música foi informada.Você precisa informar o nome da música ou um link que leve até ela.',
                    color: 'RED',
                }
            })
                .then(msg => console.log('Comando incompleto. Nenhuma música foi informada.'));
        }

        console.log(args)
        let search = args.join(' ');
    
        const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
        const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;

        const VoiceChannel = msg.member.voice.channel;
        
        let serverQueue = msg.client.queue.get(msg.guild.id);
        if (!serverQueue) {

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

        if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
            return msg.channel.send({
                embed: {
                    title: 'Isso é uma playist!',
                    description: 'utilize o comando "!playlist" para executar essa URL.',
                    color: 'RED',
                }
            })
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
            thumbnail: (await  video).thumbnail,
            url: `https://www.youtube.com/watch?v=${(await video).id}`,
        };

        serverQueue.songs.push(song);

        if (serverQueue.songs.length > 1) {
            return msg.channel.send({
                embed: {
                    title: 'Queue',
                    description: `${song.title} adicionado a lista de reprodução.`,
                    color: 'BLUE',
                }
            })
        }

        try {

            const connection = await VoiceChannel.join();
            serverQueue.connection = connection;
            play(msg, serverQueue.songs[0]);

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
};
