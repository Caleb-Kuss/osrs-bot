const { Client, IntentsBitField, ButtonStyle } = require("discord.js");
const { RecordModel } = require("../userClues");
const { ActionRowBuilder, ButtonBuilder } = require("@discordjs/builders");
require("dotenv").config({ path: ".env.local" });

const BOT_TOKEN = process.env.BOT_TOKEN;

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.MessageContent,
  ],
});

/**
 *
 * Add a role to a user
 */

const roles = [
  {
    id: "990309223353180160",
    label: "Gamers",
  },
  {
    id: "1031702038578466899",
    label: "Terraria",
  },
];

client.on("ready", async (client) => {
  try {
    const channel = client.channels.cache.get("991400206170083458");
    if (!channel) return;
    const row = new ActionRowBuilder();

    roles.forEach((role) => {
      row.components.push(
        new ButtonBuilder()
          .setCustomId(role.id)
          .setLabel(role.label)
          .setStyle(ButtonStyle.Primary)
      );
    });
    await channel.send({
      content: "Claim a role below",
      components: [row],
    });
    process.exit();
  } catch (error) {}
});

client.login(BOT_TOKEN);
