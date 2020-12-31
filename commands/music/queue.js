
module.exports.run = async (client, message, args) => {
  
  const { MessageEmbed } = require('discord.js')
  let index = 1;
  let string = "";

  const player = client.music.players.get(message.guild.id);
  if(!player) { 
    return message.channel.send('Não tem nenhum player nesse Servidor!')
 } 

 if(!player.playing) {
   return message.channel.send('Não tem nada tocando nesse Servidor')
 }

 if(!message.member.voice.channel) {
  return message.channel.send('Tu tens de estar num canal de voz ou no mesmo que eu.')
 }

  if(player.queue[0]) string += `__**Tocando Agora: **__\n ${player.queue[0].title} - Música pedida por <@${player.queue[0].requester.id}> .\n`;
  if(player.queue[1]) string += `__**Lista de Reprodução:**__\n ${player.queue.slice(1, 8).map(x => `**${index++})** [${x.title}](${x.uri}) - Música pedida por <@${x.requester.id}>.`).join("\n")}`;

  const embed = new MessageEmbed()
  .setColor('RANDOM')
  .setAuthor(`Lista de Reprodução de ${message.guild.name}`, message.guild.iconURL({ dynamic: true, size: 2048 }))
  .setThumbnail(`http://i.ytimg.com/vi/${player.queue[0].identifier}/hqdefault.jpg`)
  .setDescription(string);

  return message.channel.send(embed)
    
}

module.exports.help = {
  name: 'queue',
  category: 'musica',
  aliases: ['fila'],
}