const { Client, IntentsBitField } = require("discord.js");
const { init } = require("./db");

require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const BOT_TOKEN = process.env.BOT_TOKEN;

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.MessageContent,
  ],
});

async function watchUserGearDatabaseChanges() {
  try {
    const { db } = await init();
    const userGearCollection = db.collection("usergear");

    const changeStream = userGearCollection.watch();

    changeStream.on("change", async (change) => {
      if (change.operationType === "insert") {
        const newEntry = change.fullDocument;
        const userId = newEntry.userId;
        const gearId = newEntry.gearId;
        sendNotificationToDiscordChannel(userId, gearId);
      }
    });
  } catch (error) {
    console.error("Error setting up change stream:", error);
    throw error;
  }
}
async function watchUserCluesDatabaseChanges() {
  try {
    const { db } = await init();
    const userClueCollection = db.collection("userclues");

    const changeStream = userClueCollection.watch();

    changeStream.on("change", async (change) => {
      if (change.operationType === "insert") {
        const newEntry = change.fullDocument;
        const userId = newEntry.userId;
        const clueId = newEntry.clueId;
        sendNotificationToDiscordChannel(userId, (gearId = null), clueId);
      }
    });
  } catch (error) {
    console.error("Error setting up change stream:", error);
    throw error;
  }
}

async function sendNotificationToDiscordChannel(userId, gearId, clueId) {
  const guildId = process.env.GUILD_ID;
  const channelId = process.env.CHANNEL_ID;
  const roleId = process.env.GIM_ROLE_ID;
  const roleMention = `<@&${roleId}>`;
  try {
    const { users, gears, clues } = await init();

    const user = await users.findOne(userId);

    if (!user) {
      console.error("User not found.");
      const user = process.env.PM_ERRORS;
      const userObject = await client.users.fetch(user);

      userObject.send(
        `User not found rom this function: sendNotificationToDiscordChannel on line 57`
      );
      return;
    }
    let itemName = "";

    if (clueId) {
      const clue = await clues.findOne(clueId);

      if (clue) {
        itemName = clue.name;
      }
    } else if (gearId) {
      const gear = await gears.findOne(gearId);

      if (gear) {
        itemName = gear.name;
      }
    }

    if (!itemName) {
      console.error("Item name not found.");
      return;
    }

    const userName = user.username;

    const guild = await client.guilds.fetch(guildId);
    const channel = guild.channels.cache.get(channelId);

    channel.send(`${roleMention} ${userName} just got the ${itemName}!`);
  } catch (error) {
    console.error("Error fetching user and gear names:", error);
  }
}

/**
 *
 * Add a role to a user
 */

// client.on("interactionCreate", async (interaction) => {
//   try {
//     await interaction.deferReply({ ephemeral: true });
//     const role = interaction.guild.roles.cache.get(interaction.customId);

//     if (!role) {
//       interaction.reply({
//         content: "I couldnt find that role",
//       });
//       return;
//     }

//     const hasRole = interaction.member.roles.cache.has(role.id);

//     if (hasRole) {
//       await interaction.member.roles.remove(role);
//       await interaction.editReply(`the role ${role} has been removed.`);
//       return;
//     }
//     await interaction.member.roles.add(role);
//     await interaction.editReply(`The role ${role} has been added.`);
//   } catch (error) {
//     console.log(error);
//   }
// });

client.on("ready", (client) => {
  console.log(`${client.user.tag} is online`);
  watchUserGearDatabaseChanges();
  watchUserCluesDatabaseChanges();
});

client.login(BOT_TOKEN);
