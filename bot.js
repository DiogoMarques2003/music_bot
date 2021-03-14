//chamar liv do discord
const { Client, Intents } = require('discord.js');
const Discord = require("discord.js");
//chamar o ficheiro de carregar comando 
const fileUtils = require("./utils/fileUtils")
//chamar o config onde guardamos as informações
const config = require('./config.json');
//chamar o Erela.js que é o nosso controlador do lavalink 
const { ErelaClient } = require('erela.js');
const active = new Map();

//criar o client
const client = new Client({ ws: { intents: Intents.ALL }, disableMentions: 'everyone' });

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

client.on("ready", () => {
    console.log(`Bot foi iniciado, com ${client.users.cache.size} usuários, em ${client.channels.cache.size} canais, em ${client.guilds.cache.size} servidores.`);
        
    client.user.setPresence({ activity: { name: 'Pronto para ser seu DJ 📀' }, status: 'WATCHING' });

    //configuração do sistema do lavalink
    const nodes = [{
        tag: "Music_bot",
        host: "localhost",
        port: 2333,
        password: "password"
    }]

    //criar o construtor do lavalink
    client.music = new ErelaClient(client, nodes, { autoPlay: true });

    //logs do lavalink 
    client.music.on('nodeConnect', () => console.log('Lavalink Conectado'))
    client.music.on('nodeError', err => console.log(err))
});

//verificar o numero de pessoas no canal de voz se ele tiver a tocar
client.on("voiceStateUpdate", async (oldState, newState) => {
    try{
        const lavalink = client.music
        if(oldState.channelID === newState.channelID || !oldState.channelID) return;
        
        let guild = await client.guilds.resolve(oldState.guild.id)
        let channel = await guild.channels.resolve(oldState.channelID)

        if((channel.members.size === 1 && channel.members.has(client.user.id)) || (oldState.id === client.user.id && !newState.channelID)) {
          const player = lavalink.players.get(guild.id)
          if(player){
            lavalink.players.destroy(guild.id);
            client.channels.cache.get(player.textChannel.id).send(':sleeping: | sai do canal pois não tinha ninguém nele...')
          } 
        }
        if(oldState.id === client.user.id && newState.channelID){
          let guild = await client.guilds.resolve(newState.guild.id)
          let channel = await guild.channels.resolve(newState.channelID)
          if(!(channel.members.size === 1 && channel.members.has(client.user.id))) return ;
          const player = lavalink.players.get(guild.id)
          if(player){
            lavalink.players.destroy(guild.id); 
            client.channels.cache.get(player.textChannel.id).send(':sleeping: | sai do canal pois não tinha ninguém nele...')
          } 
        }
    }catch (e) {
        console.log(e);
    }
});

client.on("message", async message => {

    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    //responder a menções
    if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`) || message.content.startsWith(`<@${client.user.username}>`) || message.content.startsWith(`${message.guild.me}`)) {
       message.channel.send(`Meu prefixo é ${config.prefix}`)
    }

    //verifica se a mensagem começa pelo prefixo, se começar ira verificar se o comando existe e o executar
    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.split(' ');
    const cmd = args.shift().toLowerCase();;
  
    const command = getCommand(client, cmd);
    if (command) {
        command.run(client, message, args)
    }

function getCommand(client, name) {
    name = name.slice(config.prefix.length);
    
    let command = client.commands.get(name);
    if (!command) {
        command = client.commands.get(client.aliases.get(name));
    }
    return command;
}})

//sistema de carregar comandos
function start() {

    console.log('Carregando comandos...');
    loadCommands('./commands');

    console.log('Conectando o bot...');
}
function loadCommands(dir) {
    for (const dirInfo of fileUtils.searchByExtension(dir, 'js')) {
        const dirList = dirInfo.directory.split('/');
        dirList.shift();
        dirList.shift();
        const commandCategory = dirList
            .join('/');

        for (const file of dirInfo.files) {
            let cmd = require(file);
            if(!cmd.help) {
                continue;
            }
    
            client.commands.set(cmd.help.name, cmd);
            if(cmd.help.aliases) {
                cmd.help.aliases
                .filter(alias => alias.trim() !== '')
                .forEach(alias => client.aliases.set(alias, cmd.help.name));
            }
        }
        const formatedFiles = dirInfo.files.map(file => file.split('/').pop().split('.').shift())
        console.log(`[COMANDO] Foram carregados ${dirInfo.files.length} comandos na categoria ${commandCategory}. ['${formatedFiles.join(', ')}']`)
    }
}
start();

//conecta o bot a api do discord
client.login(config.discord_token);
