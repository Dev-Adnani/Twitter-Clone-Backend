const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv");  
dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE;  
const Port = process.env.PORT;

mongoose.connect(DB, { useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});
