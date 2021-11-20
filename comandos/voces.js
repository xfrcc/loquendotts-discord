const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('voces')
    .setDescription('Lista de voces disponibles'),
async execute(interaction){
    return interaction.reply('https://i.imgur.com/ZUJeP6o.png');
}}