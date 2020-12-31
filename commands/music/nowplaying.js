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

  if (player.position > 5000){
    getnowplaying()
  }
        if (player.position < 5000){
          setTimeout(() => {
          getnowplaying()
          }, 3000)
        }

        function getnowplaying(){
        let { title, duration, requester, identifier } = player.queue[0];
        let amount = `${Utils.formatTime(player.position, true)}`
        const part = Math.floor((player.position / duration) * 10);
        const giveEmbed = new MessageEmbed()
          .setColor('RANDOM')
          .setThumbnail(`http://i.ytimg.com/vi/${identifier}/hqdefault.jpg`)
          .setDescription(`${player.playing ? "▶️" : "⏸️"} Tocando Agora: ${title}\n${"▬".repeat(part) + "🔘" + "▬".repeat(10 - part)}[${amount} / ${Utils.formatTime(duration, true)}]\n Pedido por: ${requester.tag}`)

      channel.send({embed: giveEmbed}).then(m => {
          const counter = setInterval(() => {
          if(player.playing !== true){
            clearInterval(counter)
          }
        if (player.position > 5000) {
        if (player.position < 60000) {
          if (player.playing === true) {
          let { title, author, duration, thumbnail, requester } = player.queue[0];
          let amount = `00:${Utils.formatTime(player.position, true)}`
          const part = Math.floor((player.position / duration) * 10);
          giveEmbed.setDescription(`${player.playing ? "▶️" : "⏸️"} Tocando Agora: ${title}\n${"▬".repeat(part) + "🔘" + "▬".repeat(10 - part)}[${amount} / ${Utils.formatTime(duration, true)}]\n Pedido por: ${requester.tag}`)
          }
        } else {
          if(player.playing === true) {
          let { title, author, duration, thumbnail, requester } = player.queue[0];
          const amount = `${Utils.formatTime(player.position, true)}`
          const part = Math.floor((player.position / duration) * 10);
          giveEmbed.setDescription(`${player.playing ? "▶️" : "⏸️"} Tocando Agora: ${title}\n${"▬".repeat(part) + "🔘" + "▬".repeat(9 - part)}[${amount} / ${Utils.formatTime(duration, true)}]\n Pedido por: ${requester.tag}`);
          }
        }
      }
        m.edit(giveEmbed)
        }, 4000)
    })
   }
}

module.exports.help = {
  name: 'nowplaying',
  category: 'musica',
  aliases: ['np'],
}