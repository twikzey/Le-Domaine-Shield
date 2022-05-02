/**
 * Module Imports
 */
const Canvas = require('canvas');
const { Client, Collection, GuildMember, Guild } = require("discord.js");
const { readdirSync } = require("fs");
const { join } = require("path");
const CommandHandler = require("wokcommands");
const { TOKEN, PREFIX } = require("./util/Util");
const i18n = require("./util/i18n");


const client = new Client({
  disableMentions: "everyone",
  restTimeOffset: 0
});

client.login(TOKEN);
client.commands = new Collection();
client.prefix = PREFIX;
client.queue = new Map();
const cooldowns = new Collection();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Client Events
 */
client.on("ready", () => {
  console.log(`${client.user.username} ready!`);
  client.user.setActivity(` 🎉__Devo Classic use ${PREFIX}help__🎉,___🥳Made by TwikZey🥳___ `, { type: "PLAYING" });
});
client.on("warn", (info) => console.log(info));
client.on("error", console.error);

client.on('guildMemberAdd', (member ) => {
  let welcomeChannel = client.channels.cache.get('969284601132499044');
  welcomeChannel.send('**Bienvenue**, <@' +  member.id  +    '>** sur ʟᴇ ᴅᴏᴍᴀɪɴᴇ je t invite à regarder le reglement ici : <#906674909994971276>**');
});


/**
 * Import all commands
 */
const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(join(__dirname, "commands", `${file}`));
  client.commands.set(command.name, command);
}

client.on("message", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;


  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`);
  if (!prefixRegex.test(message.content)) return;

  const [, matchedPrefix] = message.content.match(prefixRegex);

  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 1) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        i18n.__mf("common.cooldownMessage", { time: timeLeft.toFixed(1), name: command.name })
      );
    }
  }


  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply(i18n.__("common.errorCommand")).catch(console.error);
  }
});

