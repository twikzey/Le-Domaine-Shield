module.exports = {
    minArgs: 1,
    requiredPermissions: ["ADMINISTRATOR", "KICK_MEMBERS"],
    syntaxError: "Incorret utiliser d!kick (Membre)",
    callback: ({message}) =>{
        const {member, mentions} = message;
        const target = mentions.users.first();
        if (target) {
            const targetMember = message.guild.members.cache.get(target.id);
            targetMember.kick();
            message.channel.send('<@${member.id}> à était kick ');
        }
    },
};