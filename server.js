/*
Takashi: js file for server
*/

var express = require('express');
var app = express();

app.use(express.static('public'));

var server = app.listen(3000, function(){
	console.log('listening on port 3000');
});

var io = require('socket.io')(server);

//--------------------------------------------

var rows = 10;
var cols = 10;

/*
var grid = new Array(cols);
for (var i = 0; i < cols; i++) {
  grid[i] = new Array(rows);
}*/

io.on('connection', function(socket){
	console.log('new user connected with id: ' + socket.id);
	socket.emit('settings', rows, cols);

	socket.on('tileClick', function(x, y) {
		console.log('Click recieved at: ' + x +', ' + y);
	});

});
