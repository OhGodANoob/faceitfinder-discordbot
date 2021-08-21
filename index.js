const { prefix, name, color } = require('./config.json')
const Discord = require('discord.js')
const fs = require('fs')
const mongo = require('./database/mongo')
const bot = new Discord.Client()

require('dotenv').config()

bot.on('ready', () => {
  console.log('🚀 Bot started!')
  mongo().then(() => {
    try {
      console.log('🧱 Connected to mongo')
    } catch (e) {
      console.error(e)
    }
  })
  
  setGuildsNumber()
})

/**
 * Setup commands
 */
bot.commands = new Discord.Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  command.aliasses.forEach(e => {
    bot.commands.set(e, command)
  })
}

bot.on('message', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return
  else {
    setGuildsNumber()
    const msg = message.content.slice(prefix.length).trim()
    const args = msg.split(/ +/)
    const command = args.shift().toLowerCase()

    if (!bot.commands.has(command))
      message.channel.send(
        new Discord.MessageEmbed()
          .setColor(color.error)
          .setDescription('**Command not found**')
          .setFooter(`${name} Error`)
      )
    else {
      try {
        bot.commands.get(command).execute(message, args)
      } catch (error) {
        console.log(error)
        message.channel.send(
          new Discord.MessageEmbed()
            .setColor(color.error)
            .setDescription('**An error has occured**')
            .setFooter(`${name} Error`)
        )
      }
    }
  }
})

const setGuildsNumber = () => {
  const Guilds = bot.guilds.cache.map(guild => guild.id)
  bot.user.setActivity(`${prefix}help | ${Guilds.length} servers`, { type: 'PLAYING' })
}

// Start the bot
bot.login(process.env.TOKEN)