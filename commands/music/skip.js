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
 if (player.queue.size <= 1){
    return channel.send("Não tem mais nenhuma musica na fila para passar a frente");
 } else {
    if(player.trackRepeat === true) {
      player.setTrackRepeat(false)
        
      player.stop()
        
      player.setTrackRepeat(true)
      return channel.send('Música Pulada com sucesso!')
    }

    player.stop();
    return channel.send("Música Pulada com sucesso!");
 }  
}

module.exports.help = {
    name: 'skip',
    category: 'musica',
    aliases: ['passar'],
}