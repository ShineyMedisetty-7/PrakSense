const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// serve frontend
app.use(express.static("public"));

let players = [];

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  // assign player number
  if (players.length < 4) {
    players.push(socket.id);
    socket.emit("playerNumber", players.length);
  } else {
    socket.emit("full");
  }

  // receive move and broadcast
  socket.on("move", (data) => {
    socket.broadcast.emit("move", data);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
    players = players.filter(id => id !== socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});