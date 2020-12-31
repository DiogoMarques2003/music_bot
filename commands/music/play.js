const { MessageEmbed } = require('discord.js');
const { Utils } = require('erela.js');

module.exports.run = async(client, message, args) => {

const member = message.member,
channel = message.channel,
guild = message.guild,
author = message.author,
lavalink = client.music
if(!message.member.voice.channel) {
  return message.channel.send('Tu tens de estar num canal de voz ou no mesmo que eu.')
 }
  const voiceChannel = member.voice.channel;
  if (!guild.me.permissions.has("CONNECT")) return channel.send("Eu não tenho a Permissão `Conectar` para fazer isso");
  if (!guild.me.permissions.has("SPEAK")) return channel.send("Eu não tenho a Permissão `Falar` para fazer isso");

  if (!args.join(' ')) return channel.send("Diga um nome para mim pesquisar ou url!");

  const player = lavalink.players.spawn({
      guild: guild,
      textChannel: channel,
      voiceChannel,
      self_deaf: true
  });

  lavalink.search(args.join(' '), author).then(async res => {
      switch (res.loadType) {
          case "TRACK_LOADED":
              player.queue.add(res.tracks[0]);
            channel.send(`<a:musica:767458705465540619> | Adicionando **${res.tracks[0].title}** \`${Utils.formatTime(res.tracks[0].duration, true)}\``).then(msg => { if (msg.deletable) msg.delete({ timeout: 5000 }) });
              if (!player.playing) player.play()
              break;

          case "NO_MATCHES":
            channel.send("Não encontrei o que você queria amigo(a)")
            break; 

          case "SEARCH_RESULT":
              let index = 1;
              const tracks = res.tracks.slice(0, 10);
              const embed = new MessageEmbed()
              .setColor('RANDOM')
                  .setAuthor("Selecione a Música", author.displayAvatarURL({ dynamic: true, size: 2048 }))
                  .setDescription(tracks.map(video => `**${index++} -** \`${video.title}\`⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
               `))
                  .setFooter("Tens 1 minuto para escolher. Usa cancel ou cancelar para cancelar a escolha.", client.user.avatarURL())

              const deleteEmbed = await channel.send(embed)

              const collector = channel.createMessageCollector(m => {
                  return m.author.id === author.id

              }, { time: 60000, max: 1 });

      collector.on("collect", m => {
        if (m.content.toLowerCase() === '1' || m.content.toLowerCase() === '2' || m.content.toLowerCase() === '3' || m.content.toLowerCase() === '4' || m.content.toLowerCase() === '5' || m.content.toLowerCase() === '6' || m.content.toLowerCase() === '7' || m.content.toLowerCase() === '8' || m.content.toLowerCase() === '9' || m.content.toLowerCase() === '10') {
        deleteEmbed.delete({ timeout: 2000 })
        m.delete({ timeout: 2000 })

        const track = tracks[Number(m.content) - 1];
        player.queue.add(track)

        channel.send(`Adicionando \`${track.title}\` com a Duração de \`${Utils.formatTime(track.duration, true)}\` na Lista de Reprodução`).then(msg => { if (msg.deletable) msg.delete({ timeout: 7000 }) });
        if (!player.playing) player.play();
      }

      let msg = m.content;
        if (msg.toLowerCase() === 'cancel' || msg.toLowerCase() === 'cancelar') return collector.stop('canceled');

    });

    collector.on("end", (_, reason) => {
      if (["time", "canceled"].includes(reason)) return channel.send("Seleção de Música cancelada!")
    });
    break;

    case "PLAYLIST_LOADED":
      res.playlist.tracks.forEach(track => player.queue.add(track));
      const duration = Utils.formatTime(res.playlist.tracks.reduce((acc, cur) => ({duration: acc.duration + cur.duration})).duration, true);
      channel.send(` Adicionando \`${res.playlist.tracks.length}\` Músicas da Playlist \`${res.playlist.info.name}\``).then(msg => { if (msg.deletable) msg.delete({ timeout: 5000 }) });
      if(!player.playing) player.play()
      break; 

  }

  const player2 = lavalink.players.get(guild.id) 
  const setI = await setInterval(function() {
      if(player2) {
        if(!player2.playing) {
        lavalink.players.destroy(guild.id)
        
        channel.send(':sleeping: | Depois de três minutos de inatividade, eu sai do canal.....')

        return clearInterval(setI)
      }
    }
  }, 1000 * 60 * 3)

}).catch(err => {
  channel.send(err)
})
}

module.exports.help = {
  name: 'play',
  category: 'musica',
  aliases: ['tocar', 'p'],
}