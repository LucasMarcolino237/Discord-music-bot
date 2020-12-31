require('dotenv').config()

const fs = require('fs');
const { Error } = require('opusscript');

const MusicClient = require('./struct/client');
const bot = new MusicClient();

const path = './struct/commands/'

fs.readdir(path, (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith('.js')) return;
        let props = require(`${path}${file}`);
        let commandName = file.split('.')[0];
        console.log(`Attempting to load command ${commandName}`);

        bot.commands.set(commandName, props)
    });
});


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
    let command = args.shift().toLowerCase();

    const cmd = bot.commands.get(command)[command];

    if (!VoiceChannel) {
        // Envia um aviso caso o canal não seja encontrado.
        console.log('Canal não encontrado.');

        return msg
            .reply('você precisa estar em um canal primeiro.')
            .then(msg => console.log(`Sent message: ${msg.content}`))
            .catch(console.error);
    }
    console.log('Canal encontrado.');
    
    try {

        // cmd = cmd[command];
        cmd(msg, args);

    } catch (error) {
        
            msg.reply('comando não informado ou inválido. Por favor informe o comando que deseja executar.');
            console.error(error);
        
        
    }
});
