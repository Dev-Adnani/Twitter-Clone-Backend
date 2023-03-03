const express = require('express')
require('./db/db-connect')

const dotenv = require("dotenv");  
dotenv.config({ path: "./config.env" });

const app = express();
const userRouter = require('./routers/userRouter')

app.use(express.json())
app.use(userRouter)
const port = process.env.PORT || 8000;

app.listen(port,() => 
{
    console.log("Server Is Up on Port : " + port);
})