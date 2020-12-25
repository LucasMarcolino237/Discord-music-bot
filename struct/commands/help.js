module.exports = {

    help(msg) {
        msg.channel.send({
            embed: {
                title: 'Help',
                description: `
                !play <songName> - Play a song from youtube
                !pause - pause music
                !resume - resume music
                !np - Get now playing song's info
                !skip - Skip to next song
                !stop - Stop playing music
                !volume <value> - adjust volume of the music
                !volume - show the current
                !queue - to see the full song queue
                `,
                color: 'GREEN'
            }
        });
    }

    
}
