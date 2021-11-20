const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('desconectar')
    .setDescription('Desconectarme del canal de voz'),
async execute(interaction){
    if(!interaction.guild.me.voice.channel) return interaction.reply('Nisiquiera estoy en un canal de voz lol');
    connection = getVoiceConnection(interaction.guild.id);
    connection.destroy();
    return interaction.reply('Bye');
}}