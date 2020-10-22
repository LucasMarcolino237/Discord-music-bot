require('dotenv').config()

const { Collection } = require('discord.js');
const MusicClient = require('./struct/client');
const commandList = require('./struct/commands');
const bot = new MusicClient();


bot.login(process.env.DISCORD_TOKEN);

bot.once('ready', () => console.log('Bot pronto para o uso!'));

bot.once('disconnect', () => console.log('Bot disconectado.'));

bot.on('message', async msg => {

    if (!msg.content.startsWith('!') || msg.author.bot) {
        return;
    }

    if (msg.channel.type === 'dm') {

        return msg.reply('Comandos não podem ser enviados dentro de DMs.')
            .then(msg => console.log(`Sent message: ${msg.content}`));
    }

    // Identifica o canal no qual o usuário está.
    const VoiceChannel = msg.member.voice.channel;
    let args = (msg.content.slice(1)).split(/ +/);
    let comando = args.shift().toLowerCase();

    if (!VoiceChannel) {
        // Envia um aviso caso o canal não seja encontrado.
        console.log('Canal não encontrado.');

        return msg.channel
        
            .send('Você precisa estar em um canal primeiro.')
            .then(msg => console.log(`Sent message: ${msg.content}`))
            .catch(console.error);
    }

    console.log('Canal encontrado.');

    const aceptedCommands = commandList[comando];

    if (aceptedCommands) {

        aceptedCommands(msg, args);
    }
});
