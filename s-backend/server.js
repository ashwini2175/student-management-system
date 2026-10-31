require("dotenv").config();
const mongoose = require("mongoose");
async function start() {
  if (!process.env.MONGO_URI) throw new Error("Set MONGO_URI in .env.");
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)
    throw new Error(
      "Set JWT_SECRET to a random secret of at least 32 characters.",
    );
  await mongoose.connect(process.env.MONGO_URI);
  const server = require("./app").listen(Number(process.env.PORT) || 5000, () =>
    console.log("Backend ready on port " + (process.env.PORT || 5000)),
  );
  const stop = () => {
    require("./utils/events").close();
    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    });
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
}
start().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
