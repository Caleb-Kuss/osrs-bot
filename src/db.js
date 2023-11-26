const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" });

let db;

async function init() {
  if (db) {
    return { db, users, gears, clues };
  }

  try {
    const client = new MongoClient(process.env.MONGODB_URI);

    await client.connect();
    db = client.db("osrs");
    users = db.collection("users");
    gears = db.collection("gears");
    clues = db.collection("clues");
    console.log(`connected to db`);
    return { db, users, gears, clues };
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

module.exports = { init };
