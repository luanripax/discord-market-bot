// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberRemove
  const BaseEvent = require('../utils/structures/BaseEvent');
module.exports = class GuildMemberRemoveEvent extends BaseEvent {
  constructor() {
    super('guildMemberRemove');
  }
  
  async run(client, member) {
    var hasTicket = false;
    client.channels.cache.forEach(async (channel)=>{
        var str = member.user.tag.replace('#', '').toLowerCase();
        if (channel.name == str || channel.name == `🛒-${str}`)
          await channel.delete().catch(err=>{});
    })
  }
}