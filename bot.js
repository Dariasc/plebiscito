require('dotenv').config()

const fetch = require('node-fetch')
const Discord = require('discord.js')
const client = new Discord.Client()

const id = '770063404424495135'
const constitutionUrl = 'http://www.servelelecciones.cl/data/elecciones_constitucion/computo/global/19001.json'
const typeUrl = 'http://www.servelelecciones.cl/data/elecciones_convencion/computo/global/19001.json'

const sendToDiscord = (constitution, type) => {
  let channel = client.channels.cache.get(id)

  let embed = new Discord.MessageEmbed()
    .setColor('#da70d6')
    .setThumbnail('https://i.imgur.com/2I1RLF7.png')
    .setTitle('Resultados del Plebiscito')
    .setDescription(`\`Mesas:\` **${constitution.totalMesasPorcent}** | ${constitution.totalMesas}\n\u200B`)
    .addFields(
      // constitución
      { name: ':green_square: `Apruebo`', value: `**${constitution.data[0].d}** | ${constitution.data[0].c}`, inline: true },
      { name: ':red_square: `Rechazo`', value: `**${constitution.data[1].d}** | ${constitution.data[1].c}`, inline: true },
    )
    .addField('\u200B', '\u200B')
    .addFields(
      // tipo de convención
      { name: ':blue_book: `Constitucional`', value: `**${type.data[1].d}** | ${type.data[1].c}`, inline: true },
      { name: ':orange_book: `Mixta Constitucional`', value: `**${type.data[0].d}** | ${type.data[0].c}`, inline: true }
    )
    .setTimestamp()
    .setFooter('SERVEL')
  channel.send(embed)
}

const fetchEndpoint = () => {
  fetch(constitutionUrl)
    .then(res => res.text())
    .then(constitution => {
      fetch(typeUrl)
        .then(res => res.text())
        .then(type => {
          sendToDiscord(JSON.parse(constitution), JSON.parse(type))
        })
    })
}

/*setTimeout(() => {
  fetchEndpoint()
}, 1000)*/

setInterval(fetchEndpoint, 1000 * 60 * 5)

client.login(process.env.TOKEN)
