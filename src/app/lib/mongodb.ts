import { MongoClient, Db } from "mongodb";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/flexdice"; // Fallback to local DB if env is missing
const DB_NAME = process.env.DB_NAME || "flexdice"; // Provide default DB name

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable.");
}

if (!DB_NAME) {
  throw new Error("Please define the DB_NAME environment variable.");
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (cachedClient && cachedDb) {
    // Return cached connection if it exists
    return cachedDb;
  }

  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);

    cachedClient = client;
    cachedDb = db;

    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw new Error("Failed to connect to the database.");
  }
}

export default connectToDatabase;

