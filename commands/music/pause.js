const { MessageEmbed } = require('discord.js');
const { Utils } = require('erela.js')

module.exports.run = async (client, message, args) => {
  const member = message.member
  const channel = message.channel
  const lavalink = client.music
  const author = message.author
  const guild = message.guild
  const player = lavalink.players.get(guild.id)

 if(!message.member.voice.channel) {
  return message.channel.send('Tu tens de estar num canal de voz ou no mesmo que eu.')
 }
      
  player.pause(true);
  return channel.send('⏸️ | Música parada');
}

module.exports.help = {
    name: 'pause',
    category: 'musica',
    aliases: ['parar'],
    description: 'Comando para pausar a musica ',
    //usage: '',
    cooldown: 5
}