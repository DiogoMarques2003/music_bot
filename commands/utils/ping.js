const Discord = require('discord.js');

exports.run = async (client, message, args, config, database) => {
    const embed1 = new Discord.MessageEmbed()
    .setTitle(`Ping?`)
    .setColor('RANDOM')
    const msg = await message.channel.send(embed1);

    const embed2 = new Discord.MessageEmbed()
    .setTitle(`Pong!`)
    .setColor('RANDOM')
    .setDescription(`:hourglass: ${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms  \n :stopwatch: ${Math.round(client.ws.ping)}ms `)
    msg.edit(embed2);
}

module.exports.help = {
    name: 'ping',
    category: 'uteis',
    //aliases: ['pp']
}