// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageUpdate
const BaseEvent = require('../utils/structures/BaseEvent');
const { MessageEmbed } = require('discord.js');
module.exports = class MessageUodateEvent extends BaseEvent {
  constructor() {
    super('messageUpdate');
  }
  
  async run(client, oldMessage, newMessage) {
      let channel = await client.channels.cache.get('850889274596917268');
      if (channel) {
        if (oldMessage.content)
          if (oldMessage.content.startsWith('!')) return;
        if (!oldMessage.content) return;
        if (oldMessage.author.id === client.user.id) return;
        const embed = new MessageEmbed()
        .setAuthor("Mensagem editada")
        .setThumbnail("https://cdn.discordapp.com/attachments/849892746856759297/850892162752446474/sync.png")
        .setTimestamp()
        .setColor(3553598)
        .addField("Mensagem de:", `${oldMessage.author.tag} - (${oldMessage.author.id})`, true)
        .addField("Canal:", `\`#${oldMessage.channel.name}\``, true)
        .addField("Mensagem original:", `**${oldMessage.content}**`, true)
        .addField("Mensagem editada:", `**${newMessage.content}**`, true)
        channel.send(embed);
    }
  }
}