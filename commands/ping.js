
module.exports = {
    name: 'ping',
    description: 'What do you think...?',
    cooldown: 5,
    guildOnly: true,
    execute(message) {
        message.channel.send('Pong.');
    },
};