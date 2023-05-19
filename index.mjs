import * as dotenv from 'dotenv';
import {Client, GatewayIntentBits, Partials} from 'discord.js';
dotenv.config();
const ignoreUserIds = ['344837487526412300'];

const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.GuildMessageReactions,
  GatewayIntentBits.GuildEmojisAndStickers,
GatewayIntentBits.MessageContent], partials: [Partials.Message, Partials.Channel, Partials.Reaction] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.ws.on("MESSAGE_REACTION_ADD", async (data) => {
  const emj = data.emoji;
  if(!data.burst || !data.guild_id || !data.channel_id || !data.member || !data.message_id || !emj) return;
  if(ignoreUserIds.includes(data.user_id)) return;
  const guild = await client.guilds.fetch(data.guild_id);
  const channel = await guild.channels.fetch(data.channel_id);
  if(!channel?.isTextBased()) return;
  const message = await channel.messages.fetch(data.message_id);
  if(!message) return;
  const toDelete = message.reactions.cache.find(e => (e.emoji.name === emj.name) || (emj.id && e.emoji.id === emj.id));
  // if(!toDelete.users.cache.find(e => e.id === data.user_id)) return;
  await toDelete.remove().catch(console.error);
  await channel.send({content: `<@!${data.user_id}> lol get scammed of your super reactions nerd`, allowedMentions: {users: [data.user_id]}});
})


client.login(process.env.TOKEN);
