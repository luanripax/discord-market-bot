const BaseCommand = require('../../utils/structures/BaseCommand');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const color = JSON.parse(fs.readFileSync(`color.json`, `utf8`));
const cfg = require('../../../config.json');

module.exports = class TicketCommand extends BaseCommand {
  constructor() {
    super('ticket', 'moderation', []);
  }

  async run(client, message, args) {
    
    if (
      await message.guild.members
        .fetch(message.author)
        .then((r) => r.roles.cache.has(cfg.roles.ceo))
    ) {

      message.channel.bulkDelete(10, true).catch((err) => {
          console.error(err);
      });

      message.delete();
      const embed = new MessageEmbed()
        .setColor(color.black)
        .setTitle('Ticket')
        .setDescription(`Olá <@&${cfg.roles.membro}>, caso queira tratar de algum dos assuntos abaixo, favor abrir um ticket, nossa equipe estará pronta para lhe atender da melhor maneira possivel!\n
        **• Compra de scripts**\n**• Orçamentos**\n**• Suporte**\n**• Outros**\n\nPara abrir um ticket basta clicar no emoji abaixo.`)
        //.addField(`• Compra de scripts\n• Orçamentos\n• Suporte\n• Outros\n`, `Para abrir um ticket basta clicar no emoji abaixo.`)
      message.channel.send(embed).then((close) => {
        close.react("🎟️")
      });
    }
  }
}