
const { Client, Collection, Intents } = require("discord.js");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require("fs");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
client.login(token);
const crypto = require('crypto');
const comandos = [];
global.listaBlanca = ['693308496011067423','758883048712044614'];
let timeoutID;
global.modo_filtro = false;
global.voces  = require('./comandos/data/voces.js');
global.nombreVoz = voces['jorge'];
global.fx_type = null;
global.fx_level = null;

const prefix = 'v';
client.commands = new Collection();
const {
    createAudioResource, getVoiceConnection,
    joinVoiceChannel, createAudioPlayer,
    NoSubscriberBehavior, AudioPlayerStatus, StreamType  } = require('@discordjs/voice');


const carpetaComandos = fs.readdirSync('./comandos').filter(file => file.endsWith('.js'));
for (const archivo of carpetaComandos){
    const comando = require(`./comandos/${archivo}`);
    comandos.push(comando.data.toJSON());
    client.commands.set(comando.data.name, comando);
}

const rest = new REST({ version: '9' }).setToken(token);
(async () => {
	try {

    //global comand
		/*await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);*/

    
    //delete commands
    //const cmds = await client.api.applications(clientId).guilds(guildId).commands.get();
    //console.log(cmds);
		//cmds.forEach(cmd => {
      //c = client.application.commands.fetch(cmd.id);
      //c.delete();
			//client.api.applications(clientId).guilds(guildId).commands(cmd.id).delete();
		//});

    // per guild commands (faster)
		await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: comandos });
	}
    catch (error){
		console.error(error);
	}
})();

client.on("ready", ()=> {
    console.log(`Iniciado como ${client.user.tag}`);
});

client.on("messageCreate", message => {
    if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot || message.content[1] != ' ') return;
        if(modo_filtro){
      if (!listaBlanca.includes(message.author.id)) return;
    }
    const texto = message.content.slice(prefix.length+1).toLowerCase();
    if (!message.member.voice.channel) return message.reply('No canal de voz, no fun');
    else if (texto.length > 600) return message.reply('No más de 600 caracteres');
    clearTimeout(timeoutID);
    timeoutID = undefined;
    const channel=client.channels.cache.get(message.member.voice.channelId);
    voice_stream(channel, texto);
});

function voice_stream(channel, texto){
    let connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator
    })
    const player = createAudioPlayer();
    connection.subscribe(player);
    const audio = obtenerUrl(texto);
    const resource = createAudioResource(audio);
    player.play(resource);
    player.on(AudioPlayerStatus.Idle, () => {
        timeoutID = setTimeout(() => {connection.destroy();}, 5*60000);
    });
}

function obtenerUrl(texto){
    const fragments = [`<engineID>${nombreVoz.engine}</engineID>`, `<voiceID>${nombreVoz.id}</voiceID>`, `<langID>${nombreVoz.language.id}</langID>`, fx_type != null ? `<FX>${fx_type}${fx_level}</FX>` : '',`<ext>mp3</ext>${texto}`];
    const hash = crypto.createHash('md5').update(fragments.join('')).digest('hex');

    const url = `https://cache-a.oddcast.com/c_fs/${hash}.mp3?engine=${nombreVoz.engine}&language=${nombreVoz.language.id}&voice=${nombreVoz.id}&text=${texto}&useUTF8=1${fx_type != null ? '&fx_type='+fx_type+'&fx_level='+fx_level : ''}`;
    return url;
  }
  client.on('interactionCreate', async interaction => {
  try{
	if (!interaction.isCommand()) return;
	const command = client.commands.get(interaction.commandName);
	if (!command) return;
	await command.execute(interaction, client, voces);
}
  catch(e){
		interaction.reply({ content: 'Ha ocurrido un error!', ephemeral: true });
    console.error(e);
	}}
);
