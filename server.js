/*
Takashi: js file for server
*/

var express = require('express');

var app = express();
var server = app.listen(3000);

app.use(express.static('public'));

var io = require('socket.io')(server);

io.sockets.on('connection', function newConnection(socket) {
	console.log("new client with id: " + socket.id);
});

console.log("Server is Running!");
