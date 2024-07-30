const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function (socket) {
  socket.on("send-location", function (data) {
    // receiving location data and sending back to front end for marker update
    io.emit("receive-location", { id: socket.id, ...data });
  });

  socket.on("disconnect",()=>{
    io.emit("user-disconnected", socket.id);
  })
});

app.get("/", (req, res) => {
  res.render("index");
});

server.listen(3000);

// process.setMaxListeners(10);
