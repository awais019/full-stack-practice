const express = require("express");
const server = require("http").createServer();
const app = express();

app.get("/", function (req, res) {
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);
server.listen(3000, function () {
  console.log("server started on port 3000");
});

// Begin websocket
const WebSocketServer = require("ws").Server;

const wss = new WebSocketServer({ server });

wss.on("connection", function connection(ws) {
  const numOfClients = wss.clients.size;
  console.log(`Clients connected ${numOfClients}`);
  wss.broadcast(`Current visitors: ${numOfClients}`);

  if (ws.readyState == ws.OPEN) {
    ws.send("Welcome to my server");
  }
  ws.on("close", function close() {
    wss.broadcast(`Current visitors: ${numOfClients}`);
    console.log("A client has just disconnected");
  });
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};
