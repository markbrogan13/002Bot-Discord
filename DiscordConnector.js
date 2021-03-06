/*
    Discord Bot By Mark Brogan
    With Use of API and Guide from: https://github.com/discordjs
*/

const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config/discord-client-secrets.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const prefix = config.prefix;
const cooldowns = new Discord.Collection();

client.on('ready', () => {
    console.log(config.motd);
});

client.on('message', message => {
    // Make sure were not talking to ourselves here lmao
    // or if the message doesnt start with the prefix defined
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // get the command without the prefix and change to lowercase
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply("Can\'t do that here Buck-o");
    }

    if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
    }
    
    if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.on('guildMemberAdd', member => {
    const channel = 
        member.guild.channels.cache.find(ch => ch.name === 'welcome');
    if (!channel) return;
    channel.send(`Ball Busters R Us: ${member} has applied for ball busting`);
    
    const role = 
        message.guild.roles.cache.find(role => role.name === "Condor Gear Users");
    member.roles.add(role);
});

client.login(config.token);