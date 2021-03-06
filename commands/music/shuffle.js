const { MessageEmbed } = require('discord.js');
const { Utils } = require('erela.js')

module.exports.run = async (client, message, args) => {
  const member = message.member
  const channel = message.channel
  const lavalink = client.music
  const author = message.author
  const guild = message.guild
  const player = lavalink.players.get(guild.id)
    
  if(!player) { 
    return message.channel.send('Não tem nenhum player nesse Servidor!')
 } 

 if(!player.playing) {
   return message.channel.send('Não tem nada tocando nesse Servidor')
 }

 if(!message.member.voice.channel) {
  return message.channel.send('Tu tens de estar num canal de voz ou no mesmo que eu.')
 }

    player.queue.shuffle()
    return channel.send('Músicas misturadas')
}

module.exports.help = {
  name: 'shuffle',
  category: 'musica',
  aliases: ['misturar'],
}