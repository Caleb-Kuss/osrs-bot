const { Client, IntentsBitField } = require("discord.js");
const { init } = require("./db");
require("dotenv").config({ path: ".env.local" });

const BOT_TOKEN = process.env.BOT_TOKEN;
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.MessageContent
  ]
});

async function watchDatabaseChanges(
  collectionName,
  idField,
  notificationFunction
) {
  try {
    const { db } = await init();
    const collection = db.collection(collectionName);

    const changeStream = collection.watch();

    changeStream.on("change", async change => {
      if (change.operationType === "insert") {
        const newEntry = change.fullDocument;
        const userId = newEntry[idField];
        notificationFunction(userId, newEntry);
      }
    });
  } catch (error) {
    console.error(
      `Error setting up change stream for ${collectionName}:`,
      error
    );
    throw error;
  }
}

async function sendNotificationToDiscordChannel(userId, entry) {
  const guildId = process.env.GUILD_ID;
  const channelId = process.env.CHANNEL_ID;
  const roleId = process.env.GIM_ROLE_ID;
  const roleMention = `<@&${roleId}>`;

  try {
    const { users, gears, clues } = await init();
    const user = await users.findOne(userId);

    if (!user) {
      console.error("User not found.");
      const errorUser = process.env.PM_ERRORS;
      const userObject = await client.users.fetch(errorUser);

      userObject.send(
        `User not found from this function: sendNotificationToDiscordChannel on line 57`
      );
      return;
    }

    let itemName = "";

    if (entry.clueId) {
      const clue = await clues.findOne(entry.clueId);
      itemName = clue ? clue.name : "";
    } else if (entry.gearId) {
      const gear = await gears.findOne(entry.gearId);
      itemName = gear ? gear.name : "";
    }

    if (!itemName) {
      console.error("Item name not found.");
      return;
    }

    const userName = user.username;

    const guild = await client.guilds.fetch(guildId);
    const channel = guild.channels.cache.get(channelId);

    const message = await channel.send(
      `${roleMention} ${userName} just got the ${itemName}!`
    );

    setTimeout(() => {
      message
        .delete()
        .catch(error =>
          userObject.send(`Time Out Error deleting message, ${message}:`, error)
        );
    }, 86400000);
  } catch (error) {
    console.error("Error fetching user and gear names:", error);
  }
}

client.on("ready", () => {
  console.log(`${client.user.tag} is online`);
  watchDatabaseChanges("usergear", "userId", sendNotificationToDiscordChannel);
  watchDatabaseChanges("userclues", "userId", sendNotificationToDiscordChannel);
});

client.login(BOT_TOKEN);
