# OSRS Bot

OSRS Bot is a Discord bot designed to alert users in a Discord channel whenever someone receives a new item in Old School Runescape. It monitors MongoDB collections for new fields and notifies the channel with details about the item and who received it.

I created this bot for my group to streamline communication. Previously, if someone obtained an item while playing alone, they had to manually alert the group on Discord and update the website I created to help us track our indiviual gear. Now, with the bot watching our MongoDB collections that are integrated with the frontend website, selecting a new item automatically triggers an alert in the Discord channel. This eliminates the need for players to manually notify the group while also updating their gear on the website.

![Discord Alert](public/images/Screenshot%20from%202024-02-10%2021-14-11.png)

## Usage

1. Run `npm i`
1. You will need some sort of frontend application that makes calles to a MongoDB collection for this to work as intended.
1. You will also need to create bot credentials for your discord channel.
1. Create a `.env.local` file and fill it with these secrets:
   - `GUILD_ID` The discord server
   - `CHANNEL_ID` The channel in the server
   - `GIM_ROLE_ID` This is the role you want to be pinged
   - `PM_ERRORS` This is used to private message the Dev if there are any errors
   - `BOT_TOKEN` The secret from when you create your discord bot
1. Modify your collections in the `db.js` file to match your needs

## Conclusion

This Discord bot provides a simple yet effective solution for monitoring MongoDB collections and alerting users in a Discord channel. It serves as a foundational tool that can be customized and expanded to include additional alerts, commands, and responses, making it adaptable to various use cases.
