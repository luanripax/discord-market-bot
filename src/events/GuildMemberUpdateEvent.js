// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberUpdate
const BaseEvent = require('../utils/structures/BaseEvent');
const { MessageEmbed } = require('discord.js');
const cfg = require('../../config.json');
module.exports = class GuildMemberUpdateEvent extends BaseEvent {
  constructor() {
    super('guildMemberUpdate');
  }
  
  async run(client, oldMember, newMember) {
   

    if(
      !oldMember._roles.includes(cfg.roles.cliente) &&
      newMember._roles.includes(cfg.roles.cliente)
    ) {

      const channel = client.channels.cache.get(cfg.channel.clientes);

      var alreadyClient = false
      await channel.messages.fetch().then(messages => {
        messages.forEach(async(msg) => {
            msg.embeds.forEach(async(embed) => {
                if(embed.title == newMember.user.id) {
                  alreadyClient = true
                }
            });
        });
      });

      if (!alreadyClient) {
        let cliente = new MessageEmbed()
            .setColor('#67aaf9')
            .setTitle(newMember.user.id)
            .setDescription(`${newMember.user}`)
            .setTimestamp()

        client.channels.fetch(cfg.channel.clientes)
        .then(channel => channel.send(cliente))
        .catch(console.error);
      }
    }
    
  }
}