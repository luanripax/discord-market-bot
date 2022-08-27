// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageDelete
const BaseEvent = require('../utils/structures/BaseEvent');
const { MessageEmbed } = require('discord.js');
module.exports = class MessageDeleteEvent extends BaseEvent {
  constructor() {
    super('messageDelete');
  }
  
  async run(client, message) {

    const channel = client.channels.cache.get('850889274596917268');
    if (channel) {
      if (message.content)
        if (message.content.startsWith(client.prefix)) return;

      if(message.author)
        if (message.author.id === client.user.id) return;

      if(message) {
        const embed = new MessageEmbed()
          .setAuthor("Mensagem deletada")
          .setThumbnail("https://cdn.discordapp.com/emojis/453706059664588835.png?v=1")
          .setTimestamp()
          .setColor(3553598)
          if (message.author)
            embed.addField("Mensagem por:", `${message.author.tag} - (${message.author.id})`, true)
          if (message.channel)
            embed.addField("Canal:", `\`#${message.channel.name}\``, true)
          if (message.content)
            embed.addField("Mensagem apagada:", `**${message.content}**`, true)
          if (message.id)
            embed.addField("ID da Mensagem:", `\`${message.id}\``, true)

        if(message.content)
          channel.send(embed);
      }
    }
  }
}