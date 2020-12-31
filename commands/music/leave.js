const { MessageEmbed } = require('discord.js');
const { Utils } = require('erela.js')

module.exports.run = async (client, message, args) => {
    const member = message.member
    const channel = message.channel
    const lavalink = client.music
    const author = message.author
    const guild = message.guild

    if(!message.member.voice.channel) {
      return message.channel.send('Tu tens de estar num canal de voz ou no mesmo que eu.')
    }
    lavalink.players.destroy(guild.id);
    channel.send(':sleeping: | Bye bye...').then(msg => msg.react('👋'))
}

module.exports.help = {
    name: 'leave',
    category: 'musica',
    aliases: ['sair'],
}