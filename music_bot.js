const Discord = require('discord.js');
const bot = new Discord.Client();
const ytdl = require('ytdl-core');
const streamOptions = {seek: 0, volume: 1};


const token = 'INSIRA_SEU_TOKEN'
bot.login(token);

bot.on('ready', () => {
    console.log('Bot pronto para o uso!')
})

bot.on('message', msg => {
    if (msg.author.bot) {
        return;
    } else {
        // Identifica o canal no qual o usuário está.
        let VoiceChannel = msg.member.voice.channel;
        if (msg.content.toLowerCase().startsWith("!play")) {
            let link = (msg.content);
            if (VoiceChannel == null) {
                console.log('Canal não encontrado.');
            } else {
                console.log('Canal encontrado.');

                VoiceChannel.join()
                .then(connection => {
                    link = (link.slice(6));
                    console.log(`Reproduzindo ${link}`);
                    // Encontra e reproduz a música escolhida.
                    const stream = ytdl(link, {filter:'audioonly'});

                    const DJ = connection.play(stream, streamOptions);
                    
                    DJ.on('end', end => {
                        console.log('Saindo do canal.')
                        VoiceChannel.leave();
                    });
                
                })
                .catch(console.error);
            }
        }
        // Retira o bot da chamada.
        if (msg.content.toLocaleLowerCase() === '!leave') {
            console.log('Saindo do canal.');
            VoiceChannel.leave();
        }
    }
})
