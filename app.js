const fs = require('fs');
const WebSocketClient = require('websocket').client;

const logFile = './logs.log';
const client = new WebSocketClient();
client.on('connectFailed', function (error) {
  console.log('Connect Error: ' + error.toString());
});

client.on('connect', function (connection) {
  console.log('WebSocket Client Connected');
  connection.on('error', function (error) {
    console.log("Connection Error: " + error.toString());
  });
  connection.on('close', function () {
    console.log('echo-protocol Connection Closed');
  });

  // connection.sendUTF(getFileTail(1, 100));
  var stats = fs.statSync(logFile)
  const stream = fs.createReadStream(logFile, { start: stats.size - 60, end: stats.size });
  stream.on("data", chunk => {
    console.log(chunk.toString());
    connection.sendUTF(chunk.toString());
  });

  fs.watchFile(logFile, (curr, prev) => {
    if (connection.connected) {

      const stream = fs.createReadStream(logFile, { start: prev.size, end: curr.size });
      stream.on("data", chunk => {
        console.log(chunk.toString());
        connection.sendUTF(chunk.toString());
      });
    }
  });
});

client.connect('ws://localhost:1337/', 'echo-protocol');
