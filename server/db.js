const mongoose = require("mongoose");
const connectionState = {
  isConnected: false,
};

async function connectToDatbase() {
  if (!connectionState.isConnected) {
    console.log("creating new database connection");
    const db = await mongoose.connect(process.env.ZOTDEGREE_MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    connectionState.isConnected = db.connections[0].readyState;
    db.connection.once("open", function () {
      console.log("Connected to MongoDB");
    });
    db.connection.on("error", console.error.bind(console, "Connection error:"));
  } else {
    console.log("using existing database connection");
  }
}

module.exports = connectToDatbase;
