const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class ClearCommand extends BaseCommand {
  constructor() {
    super('clear', 'moderation', []);
  }

  async run(client, message, args) {

    if (
      await message.guild.members
        .fetch(message.author)
        .then((r) => r.roles.cache.has('844318531876814928')) 
    ) {

      message.channel.bulkDelete(99, true).catch((err) => {
          console.error(err);
          message.channel.send(
              "Houve um erro ao tentar deletar as mensagens!"
          );
      });

    }
  }
}