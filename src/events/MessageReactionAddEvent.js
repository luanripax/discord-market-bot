// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageReactionAdd
const BaseEvent = require('../utils/structures/BaseEvent');
const {MessageEmbed} = require('discord.js');
const discord = require('discord.js');
const fs = require('fs').promises;
const fs2 = require('fs');
const path = require('path');
const color = JSON.parse(fs2.readFileSync(`color.json`, `utf8`));
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM();
const document = dom.window.document;
const cfg = require('../../config.json');
const { config } = require('process');

module.exports = class MessageReactionAddEvent extends BaseEvent {
  constructor() {
    super('messageReactionAdd');
  }
  
  async run(client, reaction, user) {

        if (user.bot)
            return

        if (reaction.message.partial) await reaction.message.fetch();
            
        if (reaction.message.channel.id == '847701601887846420' || reaction.message.channel.id == cfg.channel.teste) { 

            reaction.users.remove(user);

            if(reaction.emoji.name === "🎟️") {

                var hasTicket = false;
                reaction.message.guild.channels.cache.forEach((channel)=>{
                    var str = user.tag.replace('#', '').toLowerCase();
                    if (channel.name == str)
                        hasTicket = true;
                })

                if (!hasTicket) {
                        
                        const channel = await reaction.message.guild.channels.create(`${user.tag}`, {
                            type: 'text',
                            parent: '847701548837634098',
                            permissionOverwrites: [
                                {id: user.id, allow: ["VIEW_CHANNEL","SEND_MESSAGES"]},
                                {id: reaction.message.guild.id, deny: ['VIEW_CHANNEL'],}
                            ]
                        });

                        const welcome = new MessageEmbed()
                            .setColor(color.red)
                            .setTitle('Ticket')
                            .setDescription(`
                            Olá ${user}, seja bem-vindo(a)! Nossa equipe irá lhe atender o mais rápido possível, caso deseje adiantar qual questão deseja tratar no atendimento, fique avontade!
                            `)

                        const reactMessage = channel.send(welcome).then((close) => {
                            close.react("🔒")
                        });
                        //const reactMessage = await channel.send(`Olá ${user}, seja bem vindo`)
                } else {
                    //user.send(
                    //    `${user}, já existe um ticket aberto por você.`
                    //  );
                    let already = new MessageEmbed()
                    .setColor('#E53939')
                    .setAuthor(`⛔ | Ops ..`)
                    .setDescription(`Parece que você já tem um ticket aberto.`);
                    reaction.message.reply({embed: already}).then(m => m.delete({timeout: 2500}).catch(e => {}));
                }

            } 
        
        } else if (reaction.message.channel.id == cfg.channel.sorteio) {

            if(reaction.emoji.name === "🎁") {

                reaction.users.remove(user);

                if (
                    await reaction.message.guild.members
                      .fetch(user)
                      .then((r) => r.roles.cache.has(cfg.roles.ceo))
                  ) {

                    var peopleReacted = [];
                    var winner;
                    await reaction.message.channel.messages.fetch().then(messages => {
                        messages.forEach(async(msg) => {
                            if(msg.reactions.cache.get("🎉")) {
                                const peopleReactedBot = await msg.reactions.cache.get("🎉").users.fetch();
                                peopleReacted = await peopleReactedBot.array().filter(u => u.id !== client.user.id);
                                if (peopleReacted.length <= 0) {
                                    return reaction.message.channel.send(`Não existem participantes suficientes para participar do sorteio`);
                                } else {
                                    var index = Math.floor(Math.random() * peopleReacted.length);
                                    winner = peopleReacted[index];
                                }
                                if (!winner) {
                                    reaction.message.channel.send(`Um erro desconhecido aconteceu..`);
                                } else {
                                    reaction.message.channel.send(`<@&${cfg.roles.membro}>\n🎉 **${winner.toString()}** é o vencedor do sorteio! Parabéns ! 🎉`);
                                }
                            }
                        });
                    });

                }

            }

        }

        // Include Item
        if(reaction.emoji.name === "🛒") {

            reaction.users.remove(user);
            var scripts = cfg.scripts
            var hasBasket = false;
            var myChannel
            reaction.message.guild.channels.cache.forEach((channel)=>{
                    var str = user.tag.replace('#', '').toLowerCase();
                    var chName = `🛒-${str}`
                    if (channel.name == chName) {
                        hasBasket = true;
                        myChannel = channel
                    }
            })

            var prices = [];
                const channel = client.channels.cache.get(cfg.channel.precos);
                await channel.messages.fetch().then(messages => {
                    messages.forEach(msg => {
                        const [key, value] = msg.content.split('#')
                        prices[key] = Number(value);
                    })
            })

            if (!hasBasket) {
                const channel = await reaction.message.guild.channels.create(`🛒-${user.tag}`, {
                    type: 'text',
                    parent: '852275319973085200',
                    permissionOverwrites: [
                        //{id: user.id, allow: ["VIEW_CHANNEL", "SEND_MESSAGES"]},
                        {id: user.id, allow: ["VIEW_CHANNEL"], deny:['SEND_MESSAGES']},
                        {id: reaction.message.guild.id, deny: ['VIEW_CHANNEL'],}
                    ]
                });

                const welcome = new MessageEmbed()
                            .setTitle('Meu carrinho 🛒')
                            .setDescription(`Olá ${user}, abaixo encontram-se os itens do seu carrinho.`)
                            .addField(`• Confirmação do pedido`, 'Basta reagir no emoji abaixo para confirmar')

                const reactMessage = await channel.send(welcome).then((close) => {
                    close.react("✅")
                });

                await channel.send('**------------------------------------------------------------------**')

                
                for (var key in scripts) {
                    if (scripts[key].id == reaction.message.channel.id) {

                        //const channel = client.channels.cache.get(cfg.channel.precos);
                        //const msg = channel.messages.fetch().find(r => r.content.contains(key))
                        //console.log(msg);

                        const ex = new MessageEmbed()
                            //.setAuthor(scripts[key].image)
                            .setColor('#00CCB1')
                            .setTitle(key)
                            .setDescription(`R$${prices[key]}`)
                            .setThumbnail(scripts[key].image)
                            

                        await channel.send(ex).then((close) => {
                            close.react("🗑")
                        });

                        break;
                    }
                }

            } else {

                var hasItem = false
                for (var key in scripts) {
                    if (scripts[key].id == reaction.message.channel.id) {

                        await myChannel.messages.fetch().then(messages => {
                            messages.forEach(async(msg) => {
                                msg.embeds.forEach((embed) => {
                                    if (embed.title == key) {
                                        let already = new MessageEmbed()
                                            .setColor('#E53939')
                                            .setAuthor(`⛔ | Ops ..`)
                                            .setDescription(`Este item já está em seu carrinho.`);
                                        reaction.message.reply({embed: already}).then(m => m.delete({timeout: 2500}).catch(e => {}));
                                        hasItem = true;
                                    }
                                });
                            });
                        });

                        if (!hasItem) {

                            //console.log(msg);

                            const ex = new MessageEmbed()
                                .setColor('#00CCB1')
                                .setTitle(key)
                                .setDescription(`R$${prices[key]}`)
                                .setThumbnail(scripts[key].image)

                            await myChannel.send(ex).then((close) => {
                                close.react("🗑")
                            });

                            var alreadyHas = false
                            await myChannel.messages.fetch().then(messages => {
                                messages.forEach(async(msg) => {
                                    //if(msg.embeds.length == 0)
                                        //msg.delete().catch(err => console.log(err));
                                    msg.embeds.forEach(async(embed) => {
                                        if (embed.title == 'Confirmação do pedido') {
                                            alreadyHas = true
                                        }
                                    });
                                });
                            });

                            if (alreadyHas) {
                                await myChannel.messages.fetch().then(messages => {
                                    messages.forEach(async(msg) => {
                                        //if(msg.embeds.length == 0)
                                            //msg.delete().catch(err => console.log(err));
                                        msg.embeds.forEach(async(embed) => {
                                            if (embed.title != 'Meu carrinho 🛒') {
        
                                                var isScript = false
                                                for (var key in scripts) {
                                                    if(embed.title == key)
                                                        isScript = true
                                                }
        
                                                if (!isScript) {
                                                    await msg.delete().catch(err => console.log(err));
                                                }
                                                        
                                            }
                                        });
                                    });
                                });
                            }

                        }
                        break;
                    }
                }
            }

        }

        // Delete Item
        if(reaction.emoji.name === "🗑") {
           
            var scripts = cfg.scripts
            var str = user.tag.replace('#', '').toLowerCase();
            var chName = `🛒-${str}`
            if (reaction.message.channel.name == chName) {
                await reaction.message.delete();

                var anyScript = false
                for (var key in scripts) {
                    await reaction.message.channel.messages.fetch().then(messages => {
                        messages.forEach(async(msg) => {
                            msg.embeds.forEach((embed) => {
                                if (embed.title == key) {
                                    anyScript = true
                                }
                            });
                        });
                    });
                    if (anyScript)
                        break;
                }

                // Reset basket
                if (!anyScript) {
                    await reaction.message.channel.messages.fetch().then(messages => {
                        messages.forEach(async(msg) => {
                            //if(msg.embeds.length == 0)
                                //msg.delete().catch(err => console.log(err));
                            msg.embeds.forEach(async(embed) => {
                                if (embed.title != 'Meu carrinho 🛒') {
                                    anyScript = true
                                    await msg.delete().catch(err => console.log(err));
                                }
                            });
                        });
                    });
                } else {
                    var alreadyHas = false
                    await reaction.message.channel.messages.fetch().then(messages => {
                        messages.forEach(async(msg) => {
                            //if(msg.embeds.length == 0)
                               // msg.delete().catch(err => console.log(err));
                            msg.embeds.forEach(async(embed) => {
                                if (embed.title == 'Confirmação do pedido') {
                                    alreadyHas = true
                                }
                            });
                        });
                    });

                    if (alreadyHas) {
                        await reaction.message.channel.messages.fetch().then(messages => {
                            messages.forEach(async(msg) => {
                                //if(msg.embeds.length == 0)
                                    //msg.delete().catch(err => console.log(err));
                                msg.embeds.forEach(async(embed) => {
                                    if (embed.title != 'Meu carrinho 🛒') {

                                        var isScript = false
                                        for (var key in scripts) {
                                            if(embed.title == key)
                                                isScript = true
                                        }

                                        if (!isScript) {
                                            await msg.delete().catch(err => console.log(err));
                                        }
                                    }
                                });
                            });
                        });
                    }
                }
            }
        }   

        // Confirm order
        if(reaction.emoji.name === "✅") {
           
            var items = [];
            var scripts = cfg.scripts
            var str = user.tag.replace('#', '').toLowerCase();
            var chName = `🛒-${str}`
            if (reaction.message.channel.name == chName) {
                reaction.users.remove(user);

                var prices = [];
                const channel = client.channels.cache.get(cfg.channel.precos);
                await channel.messages.fetch().then(messages => {
                    messages.forEach(msg => {
                        const [key, value] = msg.content.split('#')
                        prices[key] = Number(value);
                    })
                })
                
                var total = 0
                await reaction.message.channel.messages.fetch().then(messages => {
                    messages.forEach(async(msg) => {
                        msg.embeds.forEach((embed) => {
                            var key = embed.title;
                            if (key in prices) {
                                //items[key] = prices[key]
                                //total += prices[key]
                                var [, price] = embed.description.split('R$')
                                items[key] = Number(price)
                                total += Number(price)
                            }
                        });
                    });
                });

                if (total > 0) {

                    var alreadyHas = false
                    await reaction.message.channel.messages.fetch().then(messages => {
                        messages.forEach(async(msg) => {
                            //if(msg.embeds.length == 0)
                                //msg.delete().catch(err => console.log(err));
                            msg.embeds.forEach(async(embed) => {
                                if (embed.title == 'Confirmação do pedido') {
                                    alreadyHas = true
                                }
                            });
                        });
                    });

                    if (!alreadyHas) {
                        let confirm = new MessageEmbed()
                            .setTitle(`Confirmação do pedido`)
                            .setDescription(`${user}, por favor verifique se o seu pedido está correto. Caso esteja, clique na reação e selecione o método de pagamento.`)

                        for (var key in items) {
                            confirm.addField(`• ${key}`, `R$ ${items[key]}`)
                        }

                        confirm.addField(`Total`, `R$ ${total}`)

                        await reaction.message.channel.send(confirm).then(close => {
                            close.react("💳")
                        })

                        //await idle.delete().catch(err => {});
                    }
                } else {
                    let already = new MessageEmbed()
                                    .setColor('#E53939')
                                    .setAuthor(`⛔ | Ops ..`)
                                    .setDescription(`Você não possui nenhum item no carrinho.`);
                     reaction.message.reply({embed: already}).then(m => m.delete({timeout: 2500}).catch(e => {}));
                }
                
            }
        } 

        // Payment
        if(reaction.emoji.name === "💳") {

            var total = 0;
            var value = 0;
            var str = user.tag.replace('#', '').toLowerCase();
            var chName = `🛒-${str}`
            if (reaction.message.channel.name == chName) {
                reaction.users.remove(user);
                reaction.message.embeds.forEach(embed =>{
                    total = embed.fields.filter(f => f.name == 'Total')
                })
                value = total[0].value

                var alreadyHas = false
                await reaction.message.channel.messages.fetch().then(messages => {
                    messages.forEach(async(msg) => {
                        //if(msg.embeds.length == 0)
                            //msg.delete();
                        msg.embeds.forEach(async(embed) => {
                            if (embed.title == 'Método de pagamento') {
                                alreadyHas = true
                            }
                        });
                    });
                });
            
                if (!alreadyHas) { 
                    let payment = new MessageEmbed()
                        .setTitle(`Método de pagamento`)
                        .setDescription(`Selecione algum dos métodos de pagamento abaixo:\n
                        🟣 PIX** (10% de desconto)**\n\n🟡 MERCADO PAGO\n\n🔵 PAYPAL\n\n🟢 PICPAY`)
                        

                    await reaction.message.channel.send(payment).then(async close =>{
                        close.react('🟣');
                        close.react('🟡');
                        close.react('🔵');
                        close.react('🟢');
                    })
                }

            }
        }

        if(reaction.emoji.name === "🟣") {

            var total = 0;
            var value = 0;
            var str = user.tag.replace('#', '').toLowerCase();
            var chName = `🛒-${str}`

            if (reaction.message.channel.name == chName) {
                reaction.users.remove(user);

                await reaction.message.channel.messages.fetch().then(messages => {
                    messages.forEach(async(msg) => {
                        msg.embeds.forEach((embed) => {
                            if (embed.fields.length > 0) {
                                for (var key in embed.fields) {
                                    if (embed.fields[key].name == 'Total') {
                                        value = Number(embed.fields[key].value.replace("R$ ", ''));
                                    }
                                }
                            }
                        });
                    });
                });

                await reaction.message.channel.messages.fetch().then(messages => {
                    messages.forEach(async(msg) => {
                        //if(msg.embeds.length == 0)
                            //msg.delete().catch(err => console.log(err));
                        msg.embeds.forEach(async(embed) => {
                            if (embed.title == '🟣 PIX' || 
                            embed.title == '🟡 Mercado Pago' ||
                            embed.title == '🔵 PayPal' || 
                            embed.title == '🟢 PicPay') {
                                await msg.delete().catch(err => console.log(err));
                            }
                        });
                    });
                });

                let method = new MessageEmbed()
                    .setTitle(`🟣 PIX`)
                    .setDescription(`${user}, segue abaixo a chave pix para realizar o pagamento:\n
                    • Chave: **${cfg.payment.pix.id}**\n\n• Nome p/ confirmação: **${cfg.payment.pix.confirm}**\n\n• Valor total: **R$${Math.floor(value - (0.1*value))}**\n\nAssim que realizar o pagamento, basta confirmar clicando na reação abaixo, e nossa equipe irá preparar o envio para você!`)

                await reaction.message.channel.send(method).then(close =>{
                    close.react('☑️');
                })
            }
        }

        if(reaction.emoji.name === "🟡") {

            var total = 0;
            var value = 0;
            var str = user.tag.replace('#', '').toLowerCase();
            var chName = `🛒-${str}`

            if (reaction.message.channel.name == chName) {
                reaction.users.remove(user);

                await reaction.message.channel.messages.fetch().then(messages => {
                    messages.forEach(async(msg) => {
                        msg.embeds.forEach((embed) => {
                            if (embed.fields.length > 0) {
                                for (var key in embed.fields) {
                                    if (embed.fields[key].name == 'Total') {
                                        value = Number(embed.fields[key].value.replace("R$ ", ''));
                                    }
                                }
                            }
                        });
                    });
                });

                await reaction.message.channel.messages.fetch().then(messages => {
                    messages.forEach(async(msg) => {
                        //if(msg.embeds.length == 0)
                            //msg.delete().catch(err => console.log(err));
                        msg.embeds.forEach(async(embed) => {
                            if (embed.title == '🟣 PIX' || 
                            embed.title == '🟡 Mercado Pago' ||
                            embed.title == '🔵 PayPal' || 
                            embed.title == '🟢 PicPay') {
                                await msg.delete().catch(err => console.log(err));
                            }
                        });
                    });
                });

                let method = new MessageEmbed()
                    .setTitle(`🟡 Mercado Pago`)
                    .setDescription(`${user}, segue abaixo o e-mail para realizar o envio do pagamento:\n
                    • E-mail: **${cfg.payment.mpago.id}**\n\n• Nome p/ confirmação: **${cfg.payment.mpago.confirm}**\n\n• Valor total: **R$${value}**\n\nAssim que realizar o pagamento, basta confirmar clicando na reação abaixo, e nossa equipe irá preparar o envio para você!`)

                await reaction.message.channel.send(method).then(close =>{
                    close.react('☑️');
                })
            }
        }

        if(reaction.emoji.name === "🔵") {

            var total = 0;
            var value = 0;
            var str = user.tag.replace('#', '').toLowerCase();
            var chName = `🛒-${str}`

            if (reaction.message.channel.name == chName) {
                reaction.users.remove(user);

                await reaction.message.channel.messages.fetch().then(messages => {
                    messages.forEach(async(msg) => {
                        msg.embeds.forEach((embed) => {
                            if (embed.fields.length > 0) {
                                for (var key in embed.fields) {
                                    if (embed.fields[key].name == 'Total') {
                                        value = Number(embed.fields[key].value.replace("R$ ", ''));
                                    }
                                }
                            }
                        });
                    });
                });

                await reaction.message.channel.messages.fetch().then(messages => {
                    messages.forEach(async(msg) => {
                        //if(msg.embeds.length == 0)
                            //msg.delete().catch(err => console.log(err));
                        msg.embeds.forEach(async(embed) => {
                            if (embed.title == '🟣 PIX' || 
                            embed.title == '🟡 Mercado Pago' ||
                            embed.title == '🔵 PayPal' || 
                            embed.title == '🟢 PicPay') {
                                await msg.delete().catch(err => console.log(err));
                            }
                        });
                    });
                });

                let method = new MessageEmbed()
                    .setTitle(`🔵 PayPal`)
                    .setDescription(`${user}, segue abaixo o e-mail para realizar o envio do pagamento:\n
                    • E-mail: **${cfg.payment.paypal.id}**\n\n• Nome p/ confirmação: **${cfg.payment.paypal.confirm}**\n\n• Valor total: **R$${value}**\n\nAssim que realizar o pagamento, basta confirmar clicando na reação abaixo, e nossa equipe irá preparar o envio para você!`)

                await reaction.message.channel.send(method).then(close =>{
                    close.react('☑️');
                })
            }
        }

        if(reaction.emoji.name === "🟢") {

            var total = 0;
            var value = 0;
            var str = user.tag.replace('#', '').toLowerCase();
            var chName = `🛒-${str}`

            if (reaction.message.channel.name == chName) {
                reaction.users.remove(user);

                await reaction.message.channel.messages.fetch().then(messages => {
                    messages.forEach(async(msg) => {
                        msg.embeds.forEach((embed) => {
                            if (embed.fields.length > 0) {
                                for (var key in embed.fields) {
                                    if (embed.fields[key].name == 'Total') {
                                        value = Number(embed.fields[key].value.replace("R$ ", ''));
                                    }
                                }
                            }
                        });
                    });
                });

                await reaction.message.channel.messages.fetch().then(messages => {
                    messages.forEach(async(msg) => {
                        //if(msg.embeds.length == 0)
                            //msg.delete().catch(err => console.log(err));
                        msg.embeds.forEach(async(embed) => {
                            if (embed.title == '🟣 PIX' || 
                            embed.title == '🟡 Mercado Pago' ||
                            embed.title == '🔵 PayPal' || 
                            embed.title == '🟢 PicPay') {
                                await msg.delete().catch(err => console.log(err));
                            }
                        });
                    });
                });

                let method = new MessageEmbed()
                    .setTitle(`🟢 PicPay`)
                    .setDescription(`${user}, segue abaixo o picpay para realizar o envio do pagamento:\n
                    • Chave: **${cfg.payment.picpay.id}**\n\n• Nome p/ confirmação: **${cfg.payment.picpay.confirm}**\n\n• Valor total: **R$${value}**\n\nAssim que realizar o pagamento, basta confirmar clicando na reação abaixo, e nossa equipe irá preparar o envio para você!`)

                await reaction.message.channel.send(method).then(close =>{
                    close.react('☑️');
                })
            }
        }

        if(reaction.emoji.name === "☑️") {

            var total = 0;
            var value = 0;
            var str = user.tag.replace('#', '').toLowerCase();
            var chName = `🛒-${str}`

            if (reaction.message.channel.name == chName) {
                reaction.users.remove(user);

                var alreadyHas = false
                await reaction.message.channel.messages.fetch().then(messages => {
                    messages.forEach(async(msg) => {
                        //if(msg.embeds.length == 0)
                            //msg.delete();
                        msg.embeds.forEach(async(embed) => {
                            if (embed.title == 'Agora é só aguardar :blush:') {
                                alreadyHas = true
                            }
                        });
                    });
                });

                if (!alreadyHas) {
                    let method = new MessageEmbed()
                        .setTitle(`Agora é só aguardar :blush:`)
                        .setDescription(`${user}, nossa equipe irá validar seu pagamento e o mais rápido possível, estaremos fazendo o envio para você!`)

                    await reaction.message.channel.send(method);
                    await reaction.message.channel.send(`<@&852779784177713152>`)
                    await reaction.message.channel.updateOverwrite(user.id, { SEND_MESSAGES: true });
                }
            }
        }
        
        // Transcript
        if(reaction.emoji.name === "🔒") {

          reaction.users.remove(user);

          if (
              await reaction.message.guild.members
                .fetch(user)
                .then((r) => r.roles.cache.has(cfg.roles.ceo))
            ) {
            reaction.message.channel.send('Fechando o canal...')

            let fileName = `st${Date.now()}.html`

            setTimeout(async() => {

                let messageCollection = new discord.Collection();
                let channelMessages = await reaction.message.channel.messages.fetch({
                limit: 100
                }).catch(err => console.log(err));

                messageCollection = messageCollection.concat(channelMessages);

                while(channelMessages.size === 100) {
                    let lastMessageId = channelMessages.lastKey();
                    channelMessages = await reaction.message.channel.messages.fetch({ limit: 100, before: lastMessageId }).catch(err => console.log(err));
                    if(channelMessages)
                        messageCollection = messageCollection.concat(channelMessages);
                }

                let filePath = path.join(__dirname, 'template.html');
                let msgs = messageCollection.array().reverse();
                let data = await fs.readFile(filePath, 'utf8', function(err, data) {
                    if (err) console.log('error', err);
                })

                if(data) {
                    await fs.writeFile(fileName, data).catch(err => console.log(err));
                    let guildElement = document.createElement('div');
                    let guildText = document.createTextNode(reaction.message.guild.name);
                    let guildImg = document.createElement('img');
                    guildImg.setAttribute('src', 'https://cdn.discordapp.com/attachments/849892746856759297/849892817333649418/WhatsApp_Image_2021-05-28_at_18.45.39.jpeg');
                    guildImg.setAttribute('width', '150');
                    guildElement.appendChild(guildImg);
                    guildElement.appendChild(guildText);
                    await fs.appendFile(fileName, guildElement.outerHTML).catch(err => console.log(err));

                    msgs.forEach(async msg => {
                        let parentContainer = document.createElement("div");
                        parentContainer.className = "parent-container";
        
                        let avatarDiv = document.createElement("div");
                        avatarDiv.className = "avatar-container";
                        let img = document.createElement('img');
                        img.setAttribute('src', "https://cdn.discordapp.com/avatars/"+msg.author.id+"/"+msg.author.avatar+".jpeg");
                        img.className = "avatar";
                        avatarDiv.appendChild(img); 

                        parentContainer.appendChild(avatarDiv);

                        let messageContainer = document.createElement('div');
                        messageContainer.className = "message-container";

                        let nameElement = document.createElement("span");
                        let name = document.createTextNode(msg.author.tag + " " + msg.createdAt.toDateString() + " " + msg.createdAt.toLocaleTimeString('en-GB',{timeZone:'America/Sao_Paulo'}) + " GMT -3:00");
                        nameElement.appendChild(name);
                        messageContainer.append(nameElement);

                        if(msg.content.startsWith("```")) {
                            let m = msg.content.replace(/```/g, "");
                            let codeNode = document.createElement("code");
                            let textNode =  document.createTextNode(m);
                            codeNode.appendChild(textNode);
                            messageContainer.appendChild(codeNode);
                        } else {
                            let msgNode = document.createElement('span');
                            let textNode = document.createTextNode(msg.content);
                            msgNode.append(textNode);
                            messageContainer.appendChild(msgNode);
                        }
                        parentContainer.appendChild(messageContainer);
                        await fs.appendFile(fileName, parentContainer.outerHTML).catch(err => console.log(err));
                    });
                }

                let filePath2 = path.join(__dirname, `../../${fileName}`);

                await reaction.message.channel.members.forEach(user => {
                    if ( !user.roles.cache.find(r => r.name === "CEO") && !user.roles.cache.find(r => r.name === "Bot") ) {
                        client.channels.cache.get('850520131494084648').send(`${user}`);
                        user.send(`Olá ${user}, aqui está o transcript referente ao seu ultimo atendimento:`)
                        user.send({
                            files: [filePath2]
                        });
                    }
                });

            
                await client.channels.cache.get('850520131494084648').send({
                    files: [filePath2]
                });

                

                setTimeout(async() => {
                await fs.unlink(filePath2, function(err, data) {
                    if (err) console.log('error', err);
                });
                }, 8000);
                
              await reaction.message.channel.delete().catch(err => console.log(err));
            }, 5000);
          }
     
        }
  }
}


