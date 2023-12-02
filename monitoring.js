import discord from "discord.js";

import screenshot from "screenshot-desktop";

const client = new discord.Client({
  intents: [
    discord.GatewayIntentBits.Guilds,
    discord.GatewayIntentBits.GuildMessages,
  ],
});
const channelId = "1179336655212130324";

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  setInterval(async () => {
    const channel = client.channels.cache.get(channelId);
    if (!channel) return console.error("Invalid channel ID");

    const messages = await channel.messages.fetch({ limit: 100 });
    await channel.bulkDelete(messages);

    console.log("deleted");

    const img = await screenshot();

    await channel.send({
      files: [
        {
          attachment: img,
          name: "screen.png",
        },
      ],
    });
  }, 60000);
});

client.login(process.env.DISCORD_KEY);
