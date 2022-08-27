const BaseCommand = require('../../utils/structures/BaseCommand');
const {MessageEmbed} = require('discord.js');
const DiscordJS = require('discord.js');

module.exports = class EnqueteCommand extends BaseCommand {
  constructor() {
    super('enquete', 'moderation', []);
  }

  async run(client, message, args) {
    
    if (
        await message.guild.members
          .fetch(message.author)
          .then((r) => r.roles.cache.has('844318531876814928')) 
      ) {

        let question = '';
        const answers = [];
        let counter = 0;
        let maxAnswers = 0;
        let bool = false;
        let i = 0;

        const filter = m => m.author.id === message.author.id;

        const collector = new DiscordJS.MessageCollector(message.channel,filter, { max: 4 });

        await message.channel.send('Quantas alternativas?');
        collector.on('collect', m => {
            if (counter == 0) {
                maxAnswers = m.content;
                m.channel.send('Qual a pergunta?');
                counter = 1;
            } else if (counter == 1) {
                question = m.content;
                counter = 2
                m.channel.send(`Digite a alternativa ${i+1}: `);
            } else if (counter == 2 && i < maxAnswers) {
                answers[i] = m.content;
                i++;
                if (i < maxAnswers)
                    m.channel.send(`Digite a alternativa ${i+1}: `); 
            }
        })

        collector.on('end', collected => {
            const enquete = new MessageEmbed()
                      .setTitle(question)
                      .addField(`🔴` ,answers[0], true)
                      .addField(`🔵`,answers[1], true)
            client.channels.cache.get('849428742026559538').send(enquete).then((close) => {
                close.react("🔴");
                close.react("🔵");
            });
        })

        

      }
  }
}