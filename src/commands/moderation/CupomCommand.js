const BaseCommand = require('../../utils/structures/BaseCommand');
const { MessageEmbed } = require('discord.js');
const cfg = require('../../../config.json');

module.exports = class CupomCommand extends BaseCommand {
  constructor() {
    super('cupom', 'moderation', []);
  }

  async run(client, message, args) {
    if (true) {
      let cliente = args[0];
      let cupom = args[1];
      let discount = args[2];
      let validade = args[3];

      if (
        await message.guild.members
          .fetch(message.author)
          .then((r) => r.roles.cache.has(cfg.roles.ceo))
      ) {

        message.delete();
        const embed = new MessageEmbed()
          .setTitle('🏷 Cupom de desconto 🏷')
          .setDescription(`Olá <@${cliente}>, você acabou de ganhar um cupom de desconto para usar como quiser em nossa loja, aproveite!`)
          .addField(`Cupom`, cupom)
          .addField(`Desconto`, discount)
          .addField(`Valido até`, validade)

        client.users.fetch(cliente, false).then((user) => {
          user.send(embed);
        });
        message.channel.send(embed);

      }

    }
  }
}