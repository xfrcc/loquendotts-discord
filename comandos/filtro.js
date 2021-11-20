const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('filtro')
    .setDescription('Activar/desactivar restriccion'),
async execute(interaction){
    if (!listaBlanca.includes(interaction.member.id)) return interaction.reply('N');
        if(modo_filtro == false){
        modo_filtro = true;
        return interaction.reply('Modo filtro: Activado');
    }
    else{
        modo_filtro = false;
        return interaction.reply('Modo lento: Desactivado');
    }}
}