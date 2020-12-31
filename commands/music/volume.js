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
          
  if (!args[0]) return channel.send(`Volume Atual é de ${player.volume}%`);
  if (Number(args[0]) <= 0 || Number(args[0]) > 100) return channel.send("Diz um volume que seja de 1 até 100!");

  player.setVolume(Number(args[0]));
  return channel.send(`Agora o volume é de ${args[0]}%`)
}

module.exports.help = {
  name: 'volume',
  category: 'musica',
  //aliases: ['volume'],
  cooldown: 5
}