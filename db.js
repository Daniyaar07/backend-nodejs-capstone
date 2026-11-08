
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        return client.db("secondChanceDB");
    } catch (error) {
        console.log("MongoDB connection error:", error);
        throw error;
    }
}

module.exports = { connectToDatabase };
