const mongoose = require("mongoose");

async function connectDB() {
    try {
        console.log("Connecting to:", process.env.MONGO_URI);

        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
        });

        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.log("❌ Database Connection Failed");
        console.log("Name:", error.name);
        console.log("Message:", error.message);
        console.log("Stack:", error.stack);
    }
}

module.exports = connectDB;