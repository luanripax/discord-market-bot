const BaseCommand = require('../../utils/structures/BaseCommand');

const { MessageEmbed } = require('discord.js');
const cfg = require('../../../config.json');

const perg = [
  `**Qual o título do sorteio?**`,
  '**O que será sorteado?**',
  `**Quanto tempo esse sorteio irá durar?**
  \`Use s|m|h|d\` 
  `,
  '**Quantos ganhadores?**'
]

module.exports = class SorteioCommand extends BaseCommand {
  constructor() {
    super('sorteio', 'moderation', []);
  }

  async run(client, message, args) {

    if (
      await message.guild.members
        .fetch(message.author)
        .then((r) => r.roles.cache.has(cfg.roles.ceo))
    ) {

      const response = await getResponses(message);
      var texto = `**Número de ganhadores:** ${response.winners}\n`
      const embed = new MessageEmbed()
      .setTitle(`${response.title}\n`)
      .setDescription(`
      **Valendo:** ${response.prize}\n
      ${texto}
      **Duração:** ${response.duration}\n\n
      **Reaja abaixo para participar!**
      `)
      .setThumbnail('https://acegif.com/wp-content/uploads/firework-16.gif')

      const msg = await client.channels.cache.get(cfg.channel.sorteio).send(embed);
      await msg.react('🎉');
    }
  }
}

async function getResponses(message) {
  const validTime = /^\d+(s|m|h|d)$/;
  const validNumber = /\d+/;
  const responses = {}

  for (let i = 0; i < perg.length; i++) {
      await message.channel.send(perg[i])

      const response = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1 });
      const { content } = response.first();

      if (i === 0)
          responses.title = content;
      else if (i === 1)
          responses.prize = content;
      else if (i === 2)
          if (true)
              responses.duration = content;
          else
              throw new Error('Duração incorreta!')
      else if (i === 3) {
          if (validNumber.test(content))
              responses.winners = content;
          else
              throw new Error('Número de vencedores inválido!')
      }
  }
  return responses
}
