const { MessageEmbed } = require('discord.js');
const { trimRight } = require('ffmpeg-static');
const { PREFIX, LOCALE } = require("../util/Util");
const i18n = require("i18n");
i18n.setLocale(LOCALE);

module.exports = {
    name: "clear",
    description: i18n.__('Supprime des messages'),
    async execute(message, args) {

        if (message.member.hasPermission(["ADMINISTRATOR", "MANAGE_MESSAGES"])) {

            let args = message.content.trim().split(/ +/g);

            if (args[1]) {
                if (!isNaN(args[1]) && args[1] >= 1 && args[1] <= 99) {

                    message.channel.bulkDelete(args[1])
                    const ClearEmbed = new MessageEmbed()
                        .setColor('#3433FF')
                        .setDescription(`**Voila les ${args[1]} messages sont suprimer, pas de quoi surtout ne dit pas merci.**`)
                    message.channel.send(ClearEmbed).then(s => { setTimeout(() => { s.delete(); }, 5000) });

                }
                else {
                    const SupEmbed = new MessageEmbed()
                        .setColor('#3433FF')
                        .setDescription(`**Je peux que suprimer des messages entre 1 et 99.**`)
                    message.channel.send(SupEmbed).then(s => { setTimeout(() => { s.delete(); }, 5000) });
                }
            }
            else {
                const VideEmbed = new MessageEmbed()
                        .setColor('#3433FF')
                        .setDescription(`**Il faut mettre un nombre de message à suprimer, sinon moi je ne peux pas suprimer dans le vide.**`)
                    message.channel.send(VideEmbed).then(s => { setTimeout(() => { s.delete(); }, 5000) });
            }
        }
        else {
            const PermisionEmbed = new MessageEmbed()
                        .setColor('#3433FF')
                        .setDescription(`**Vous n'avez pas les permision de faire cela.**`)
                    message.channel.send(PermisionEmbed).then(s => { setTimeout(() => { s.delete(); }, 5000) });
        }
    }
};