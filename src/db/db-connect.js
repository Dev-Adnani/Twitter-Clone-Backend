const { default: mongoose } = require("mongoose");

const URI = process.env.MONGODB_URL;

mongoose.connect(URI, { useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});
