// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberAdd
const BaseEvent = require('../utils/structures/BaseEvent');
const cfg = require('../../config.json');
module.exports = class GuildMemberAddEvent extends BaseEvent {
  constructor() {
    super('guildMemberAdd');
  }
  
  async run(client, member) {

    member.guild.fetchInvites().then( invites => {
      invites.array().forEach(element => {
        //console.log('---------------------')
        //console.log(element.inviter.username);
        //console.log(element.uses)
        //console.log(element.targetUser);
        if(element.targetUser) {
          //console.log(element.targetUser.username);
        } else {
          //console.log('null');
        }
      });
    });

    const channel = client.channels.cache.get(cfg.channel.clientes);

    await channel.messages.fetch().then(messages => {
      messages.forEach(async(msg) => {
          //if(msg.embeds.length == 0)
              //msg.delete();
          msg.embeds.forEach(async(embed) => {
              if(embed.title == member.user.id) {
                //console.log('ja é cliente');
                var role = member.guild.roles.cache.find(role => role.name === 'Cliente');
                if (role)
                  member.roles.add(role);
              }
          });
      });
    });

    var role = member.guild.roles.cache.find(role => role.name === 'Membro');
    if (role)
      member.roles.add(role);
  }

  
}