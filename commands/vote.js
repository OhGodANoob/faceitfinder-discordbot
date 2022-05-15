const { name, vote, color } = require('../config.json')
const Discord = require('discord.js')

module.exports = {
  name: 'vote',
  options: [],
  description: 'Get the link to vote for the bot on top.gg',
  usage: '',
  type: 'system',
  async execute(interaction) {
    return {
      embeds: [
        new Discord.MessageEmbed()
          .setColor(color.primary)
          .setAuthor({ name: name, iconURL: 'attachment://logo.png' })
          .setDescription(`Hey <@${interaction.user.id}> you can vote for me on the following link\n${vote}`)
          .setFooter({ text: `${name} Vote` })
      ],
      files: [
        new Discord.MessageAttachment('./images/logo.png', 'logo.png')
      ]
    }
  }
}