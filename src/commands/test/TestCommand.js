const BaseCommand = require('../../utils/structures/BaseCommand');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const color = JSON.parse(fs.readFileSync(`color.json`, `utf8`));

module.exports = class TestCommand extends BaseCommand {
  constructor() {
    super('test', 'testing', []);
  }

  async run(client, message, args) {

  }
}