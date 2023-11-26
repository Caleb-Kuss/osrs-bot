const { log } = require("console");
const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");
require("dotenv").config({ path: ".env.local" });

const commands = [
  // {
  //   name: "add",
  //   description: "add shit",
  //   options: [
  //     {
  //       name: "first-number",
  //       description: "The first number",
  //       type: ApplicationCommandOptionType.Number,
  //       required: true,
  //       choices: [
  //         {
  //           name: "one",
  //           value: 1,
  //         },
  //       ],
  //     },
  //     {
  //       name: "second-number",
  //       description: "The second number",
  //       type: ApplicationCommandOptionType.Number,
  //       required: true,
  //     },
  //   ],
  // },
  /**
   *
   * Maybe add a command to add people to roles easily
   */
];

const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log(`getting commands`);
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );
    console.log(`sent the commands`);
  } catch (error) {
    console.log(error);
  }
})();
