var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer();
server.listen(1337, function () {
  console.log((new Date()) + ' Server is listening on port 1337');
});

wsServer = new WebSocketServer({
  httpServer: server,
});

function originIsAllowed(origin) {
  return true;
}

wsServer.on('request', function (request) {
  if (!originIsAllowed(request.origin)) {
    request.reject();
    console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
    return;
  }

  var connection = request.accept('echo-protocol', request.origin);
  console.log((new Date()) + ' Connection accepted.');
  connection.on('message', function (message) {
    if (message.type === 'utf8') {
      console.log(message.utf8Data);
    }
  });
  connection.on('close', function (reasonCode, description) {
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  });
});