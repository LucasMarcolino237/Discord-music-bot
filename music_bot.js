const Discord = require('discord.js');
const bot = new Discord.Client();
const ytdl = require('ytdl-core');
const streamOptions = {seek: 0, volume: 1};


const token = 'INSIRA_O_SEU_TOKEN'
bot.login(token);

bot.on('ready', () => {
    console.log('Bot pronto para o uso!')
})

bot.on('message', msg => {
    if (msg.author.bot) {
        return;
    }
    if (msg.content.toLowerCase().startsWith("!play")) {
        let VoiceChannel = msg.guild.channels.cache.find( channel => channel.id === '697637636411752502')
        if (VoiceChannel == null) {
            console.log('Canal não encontrado.')
        } else {
            console.log('Canal encontrado.')

            VoiceChannel.join()
            .then(connection => {
                var link = 'https://www.youtube.com/watch?v=SYM-RJwSGQ8';
                console.log(`Reproduzindo ${link}`)
                const stream = ytdl(link, {filter:'audioonly'})

                const DJ = connection.play(stream, streamOptions);
                DJ.on('end', end => {
                    VoiceChannel.leave();
                });
            })
            .catch(console.error);
        }
    }
})
