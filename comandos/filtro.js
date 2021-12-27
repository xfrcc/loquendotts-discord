const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('filtro')
    .setDescription('Activar/desactivar restriccion'),
async execute(interaction){
    if (!listaBlanca.includes(interaction.member.id)) return interaction.reply('N');
    
    if(modo_filtro){
        modo_filtro = false;
        return interaction.reply('Filtro desactivado');
    }
    else{
        modo_filtro = true;
        return interaction.reply('Filtro activado');
    }}
}
