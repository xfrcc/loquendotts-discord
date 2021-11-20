const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const voztxt = fs.readFileSync(`./comandos/data/nombrevoces.txt`).toString('utf-8').split('\n');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('cambiarvoz')
    .setDescription('Cambia la voz por las disponibles')
    .addStringOption(option => option.setName('voz').setDescription('voz a elegir').setRequired(true)),
async execute(interaction){
        const voz = interaction.options.getString('voz').toLowerCase();
        if (!voztxt.includes(voz)) return interaction.reply('Esa voz no existe, porfavor ingresa el comando /voces para ver las disponibles');
        nombreVoz = voces[voz];
        return interaction.reply(`Elegido ${voz}`);
}}