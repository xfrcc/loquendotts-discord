const discord = require("discord.js");
const client = new discord.Client();
client.login('TOKEN');
const crypto = require('crypto');
const fs = require('fs');
const  buildUrl = require('build-url');

var id = 6; // id y engine por default es Jorge
var engine = 2;
var fx_type = null;
var fx_level = null;

const prefix = 'v';
var esta_sonando;
var modo_filtro = false;
var voz;
var listaBlanca = [];
const voces = JSON.parse(fs.readFileSync('voces.json'));
const efectos = JSON.parse(fs.readFileSync('efectos.json'));
var efectosnombres =['pitch','velocidad','duracion','eco','bullhorn','whisper'];
var vocesnombres = ['carlos','carmen','diego','duardo','esperanza','francisca','francisco','gloria','javier','jorge','juan','leonor','lola','manuel','monica','paulina','soledad','violeta','ximena'];

client.on("ready",()=>{
    console.log('Iniciado como '+client.user.username);
});

client.on("message",message=>{
    if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const comando = args.shift().toLowerCase();
    mensaje_enviado = message.content.toLowerCase();
    if(comando == 'voces') return message.channel.send(vocesnombres);
    else if (comando == 'cambiar'){
        if(!vocesnombres.includes(args[0])) return;
        voz = args[0];
        let index = ocurrencia(voz, vocesnombres);
        id = voces.voz[index].id;
        engine = voces.voz[index].engine;
        return message.channel.send('Ok');
    }
    else if(comando == 'desconectar'){
        if(!message.guild.me.voice.channel) return message.channel.send('Nisiquiera estoy en un canal de voz lol');
        message.guild.me.voice.channel.leave();
        return message.channel.send('Bye');
    }
    else if(comando == 'efectos'){
        if(args.length == 0 || args.length > 2){
            message.channel.send(efectosnombres);
            message.channel.send('```vefectos [efecto] [cantidad]```');
            return;
        }
        if(args[0] == 'normal'){
            fx_type = null;
            fx_level = null;
            return message.channel.send('Desactivados efectos');
        }
        let index = ocurrencia(args[0].toLowerCase(), efectosnombres);
        if(index != -1){
        if(!args[1]){
            return message.channel.send(`Efecto ${args[0]} cantidad entre ${efectos.efecto[index].min} y ${efectos.efecto[index].max}`)
        }
        if(isNaN(args[1])){
            return;
        }
        console.log(Math.trunc(args[1]));
        if(Math.trunc(args[1]) >= efectos.efecto[index].min && Math.trunc(args[1]) <= efectos.efecto[index].max && Math.trunc(args[1]) != 0){
            fx_type = efectos.efecto[index].nombre;
            fx_level = Math.trunc(args[1]);
            return message.channel.send(`Aplicado efecto ${efectosnombres[index]}`);
        }
        else{
            return message.channel.send(`Cantidad del efecto debe estar entre ${efectos.efecto[index].min} y ${efectos.efecto[index].max}`);
        }
        }
        else{
            return message.channel.send(`No existe ese efecto`);
        }
    }
    else if(comando == 'filtro'){
    if (listaBlanca.includes(message.author.id)){
        if(modo_filtro == false){
        modo_filtro = true;
        return message.channel.send('Modo filtro: Activado u.u');
    }
        else if (modo_filtro == true){
        modo_filtro = false;
        return message.channel.send('Modo lento: Desactivado, epic');
    }}
    else{
        return message.channel.send('No flaco no puedo hacer eso por ti');
    }
}
    if (mensaje_enviado[1] != ' ' ) return;
    
    const texto = mensaje_enviado.slice(prefix.length+1).toLowerCase();
    if (!texto.length) return;
    else if (!message.member.voice.channel) return message.reply('No canal de voz, no fun');
    else if (texto.length > 600) return message.reply('No más de 600 caracteres');
    var channel=client.channels.cache.get(message.member.voice.channelID);

    if (modo_filtro == true){
        if (!listaBlanca.includes(message.author.id)) return message.reply('Perdón flaco :(');
        voice_stream(client, channel, message, texto);
    }
    else{
        voice_stream(client, channel, message, texto);
    } 
});

function voice_stream(client, channel, message, texto){
    if (esta_sonando == true){
        return message.channel.send('Ya hay un mensaje reproduciendose, espera que termine.');
    }
    else{
    channel.join().then(connection => {
        esta_sonando = true;
        var dispatcher = connection.play(obtenerUrl(texto));
        dispatcher.on('finish', () => {
            esta_sonando = false;
            dispatcher.destroy();
            return;
        });
    });
}}

function obtenerUrl(texto){
    let fragments = [
      `<engineID>${engine}</engineID>`,
      `<voiceID>${id}</voiceID>`,
      `<langID>${2}</langID>`,
      `<FX>${fx_type}${fx_level}</FX>`,
      '<ext>mp3</ext>',
      texto
    ];
    if(!fx_type && !fx_level){
        fragments = [
            `<engineID>${engine}</engineID>`,
            `<voiceID>${id}</voiceID>`,
            `<langID>${2}</langID>`,
            '<ext>mp3</ext>',
            texto
          ];
    }
    const hash = crypto.createHash('md5').update(fragments.join("")).digest('hex');

    let url = buildUrl(
        'https://cache-a.oddcast.com',
        {
          path: `c_fs/${hash}.mp3`,
          queryParams: {
            engine: engine,
            language: 2,
            voice: id,
            text: texto,
            useUTF8: 1,
            fx_type: fx_type,
            fx_level: fx_level,
          }
        }
      );
    if(!fx_type && !fx_level){
        url = buildUrl(
            'https://cache-a.oddcast.com',
            {
              path: `c_fs/${hash}.mp3`,
              queryParams: {
                engine: engine,
                language: 2,
                voice: id,
                text: texto,
                useUTF8: 1,
              }
            }
          );
    }
    return url;
  }

  function ocurrencia(string, array){
    for(let i=0; i<array.length;i++){
      if (string == array[i]){
        return i;
      }
    }
    return -1;
  }