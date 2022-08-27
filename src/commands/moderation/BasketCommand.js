const BaseCommand = require('../../utils/structures/BaseCommand');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const color = JSON.parse(fs.readFileSync(`color.json`, `utf8`));
const cfg = require('../../../config.json');

module.exports = class BasketCommand extends BaseCommand {
  constructor() {
    super('basket', 'moderation', []);
  }

  async run(client, message, args) {
    if (
      await message.guild.members
        .fetch(message.author)
        .then((r) => r.roles.cache.has(cfg.roles.ceo))
    ) {

      message.delete();
      const embed = new MessageEmbed()
        .setColor(color.black)
        .setTitle('Comprar')
        .setDescription(`Olá <@&${cfg.roles.membro}>, caso deseje adquirir este script basta coloca-lo ao seu carrinho reagindo abaixo ou então abrindo um ticket de atendimento.`)
      message.channel.send(embed).then((close) => {
        close.react("🛒")
      });

    }
  }
}