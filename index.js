//import library, configuration
const { createServer } = require("http");
const express = require("express");
const cookieparser = require('cookie-parser');
const initAPIs = require("./routes/api")
const cors = require('cors');
const serverSocket = require('./config/socket')

require("dotenv").config();
require("./config/db").connect();

//init
const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieparser());
app.use(cors())
//router
initAPIs(app);
//create server
const httpServer = createServer(app);

//init socket connect
serverSocket(httpServer)

//start server
httpServer .listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})