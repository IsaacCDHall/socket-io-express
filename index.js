const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config({ path: ".env" });

const server = http.createServer(app);
const io = socketio(server);

//this may double parse things
// app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "client/build")));
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
require("./routes/tweets.js")(app, io);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});
const port = process.env.PORT || 3001;
app.listen(port);

console.log(`Password generator listening on ${port}`);

// server.listen(port, () => {
//   console.log("server is up");
// });
// establish socket io connection