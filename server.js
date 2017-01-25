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

function Tile (x, y) {
	this.x = x;
	this.y = y;
	this.mine = false;
}

var rows = 10;
var cols = 10;
var mines = 30;

var board = new Array(cols);
for(var i = 0; i < board.length; i++)
	board(i) = new Array(rows);

for(var i = 0; i < board.length; i++)
	for(var j = 0; j < board(i).length; j++)
		board(i)(j) = new Tile(i)(j);

for(var i = 0; i <= mines; i++) {
	var a = ((Math.random() * rows) + 1);
	var b = ((Math.random() * cols) + 1);
	if(board(a)(b).mine)
		i--;
	else {
		board(a)(b).mine = true;
		console.log(board(a)(b).x + " " + board(a)(b).y)
	}
}

io.on('connection', function(socket){
	console.log('new user connected with id: ' + socket.id);
	socket.emit('settings', rows, cols);

	socket.on('tileClick', function(x, y) {
		console.log('Click recieved at: ' + x +', ' + y);
	});

});
