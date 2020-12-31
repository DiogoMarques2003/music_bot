const { MessageEmbed } = require('discord.js');
const { Utils } = require('erela.js')

module.exports.run = async (client, message, args) => {
  const member = message.member
  const channel = message.channel
  const lavalink = client.music
  const author = message.author
  const guild = message.guild
  const player = lavalink.players.get(guild.id);
  if(!player) { 
    return message.channel.send('Não tem nenhum player nesse Servidor!')
 } 

 if(!player.playing) {
   return message.channel.send('Não tem nada tocando nesse Servidor')
 }

 if(!message.member.voice.channel) {
  return message.channel.send('Tu tens de estar num canal de voz ou no mesmo que eu.')
 }
   
    const loopType = args[0]

      if(!['queue', 'track'].includes(loopType)) return message.channel.send('Diz [queue/track] para continuar')

      switch(loopType) {
        case 'queue':
          player.setQueueRepeat(!player.queueRepeat)
                
          const msg = player.queueRepeat ? 'Ativando Loop na Lista de Reprodução' : 'Desativando Loop da Lista de Reprodução'
          message.channel.send(msg)
          break;
            
        case 'track':
          player.setTrackRepeat(!player.trackRepeat)

          const { title } = player.queue[0]
          const trackMsg = player.trackRepeat ? 'Ativando Loop em ' + title : 'Desativando loop em ' + title
                
          message.channel.send(trackMsg)
          break;
      }
}

module.exports.help = {
  name: 'loop',
  category: 'musica',
  aliases: ['ciclo'],
}