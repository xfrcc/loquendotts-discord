const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const efectos = JSON.parse(fs.readFileSync(`./comandos/data/efectos.json`));


module.exports = {
    data: new SlashCommandBuilder()
    .setName('efectos')
    .setDescription('Efectos disponibles para la voz')
    .addSubcommand(subcommand =>subcommand.setName('normal').setDescription('Desactiva todos los efectos').addIntegerOption(option => option.setName('cantidad').setDescription('Cantidad del efecto')))
    .addSubcommand(subcommand =>subcommand.setName('pitch').setDescription('Aumenta/Disminuye el tono').addIntegerOption(option => option.setName('cantidad').setDescription('Cantidad del efecto')))
    .addSubcommand(subcommand =>subcommand.setName('velocidad').setDescription('Aumenta/Disminuye velocidad').addIntegerOption(option => option.setName('cantidad').setDescription('Cantidad del efecto')))
    .addSubcommand(subcommand =>subcommand.setName('duracion').setDescription('Aumenta/Disminuye velocidad').addIntegerOption(option => option.setName('cantidad').setDescription('Cantidad del efecto')))
    .addSubcommand(subcommand =>subcommand.setName('eco').setDescription('Aumenta/Disminuye eco').addIntegerOption(option => option.setName('cantidad').setDescription('Cantidad del efecto')))
    .addSubcommand(subcommand =>subcommand.setName('anuel').setDescription('Anuel 2015 efecto telefono').addIntegerOption(option => option.setName('cantidad').setDescription('Cantidad del efecto')))
    .addSubcommand(subcommand =>subcommand.setName('whisper').setDescription('Efecto demonio 0_0').addIntegerOption(option => option.setName('cantidad').setDescription('Cantidad del efecto'))),
async execute(interaction){
        const efectosnombres =['pitch','velocidad','duracion','eco','anuel','whisper'];
        const efecto = interaction.options.getSubcommand();
        const cantidad = interaction.options.getInteger('cantidad');
        let index = ocurrencia(efecto, efectosnombres);
        if(efecto == 'normal'){
            fx_type = null;
            fx_level = null;
            return interaction.reply('Desactivados efectos');
        }
        else if(!cantidad){
            return interaction.reply(`Efecto ${efecto} cantidad entre ${efectos.efecto[index].min} y ${efectos.efecto[index].max}`)
        }
        else if(Math.trunc(cantidad) >= efectos.efecto[index].min && Math.trunc(cantidad) <= efectos.efecto[index].max && Math.trunc(cantidad) != 0){
            fx_type = efectos.efecto[index].nombre;
            fx_level = Math.trunc(cantidad);
            return interaction.reply(`Aplicado efecto ${efectosnombres[index]}`);
        }
        else{
            return interaction.reply(`Cantidad del efecto debe estar entre ${efectos.efecto[index].min} y ${efectos.efecto[index].max}`);
        }
}}

function ocurrencia(string, array){
    for(let i=0; i<array.length;i++){
      if (string == array[i]){
        return i;
      }
    }
    return -1;
  }