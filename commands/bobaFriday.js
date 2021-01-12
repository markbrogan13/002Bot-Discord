const embed = {
    "title": "Where and when would you like to get Boba Friday?",
    "description": "Fill out this form before friday: [Boba Weekly Form](https://forms.gle/WptybD3umb3TedWj6)",
    "color": 391374,
};

module.exports = {
    name: 'boba',
    description: 'Automatic reminder for all the BobaBitches',
    cooldown: 5,
    guildOnly: true,
    execute(message) {
        message.channel.send({ embed });
    },
};