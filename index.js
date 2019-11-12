const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config({ path: "./.env" });
const port = process.env.PORT || 3001;
const index = path.join(__dirname + "/client/build/index.html");

const server = http.createServer(app);
const io = socketIO(server);
// const cors = require("cors");
// app.use(cors());

//this may double parse things
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "client/build")));
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

app.get("*", (req, res) => {
  res.sendFile(index);
});
// console.log(app.get("/",(req, res) => { return res }));
// const server = express()
// .use((req, res) =>
// res.sendFile(index)
// )
// .listen(port, () => console.log(`Listening on ${port}`));
// const io = socketIO(server);
require("./routes/tweets.js")(app, io);

server.listen(port, () => {
  console.log("server is up on " + port);
});




// establish socket io connection
// const express = require("express");
// const http = require("http");
// const socketIO = require("socket.io");
// const path = require("path");
// const bodyParser = require("body-parser");
// const app = express();
// const server = http.createServer(app);

// require("dotenv").config({ path: "./.env" });
// const port = process.env.PORT || 3001;
// const index = path.join(__dirname + "/client/build/index.html");
// // const server = express()
// //   .use((req, res) =>
// //     res.sendFile(index)
// //   )
// //   .listen(port, () => console.log(`Listening on ${port}`));
// const io = socketIO(server);


// app.use(bodyParser.json());
// app.use(express.static(index));

// require("./routes/tweets.js")(app, io);

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname + "/client/build/index.html"));
// });

// server.listen(port, () => {
//   console.log("server is up on " + port);
// });
// establish socket io connection