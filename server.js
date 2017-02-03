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

function Tile(x, y, content) {
	this.x = x;
	this.y = y;
	this.content = content;
}

var rows = 10;
var cols = 10;
var mines = 30;

var board = new Array(cols);
for(var i = 0; i < board.length; i++)
	board[i] = new Array(rows);

for(var i = 0; i < board.length; i++)
	for(var j = 0; j < board[i].length; j++)
		board[i][j] = new Tile(i, j, 0);

for(var i = 0; i <= mines; i++) {
	var a = Math.floor(Math.random() * rows);
	var b = Math.floor(Math.random() * cols);
	if(board[a][b].content == 9)
		i--;
	else {
		board[a][b].content = 9;
		console.log(board[a][b].x + " " + board[a][b].y)
	}
}


io.on('connection', function(socket){
	console.log('new user connected with id: ' + socket.id);
	socket.emit('settings', rows, cols);
	socket.on('tileClick', function(x, y) {
		console.log('Click recieved at: ' + x +', ' + y);
		if(board[x][y].content == 9)
		{
			var myCreation = {};
			myCreation.data = new Array(1);
			myCreation.data[0] = new Tile(x, y, 9);
			console.log("myCreation: " + myCreation.data[0].x + ", " + myCreation.data[0].y + ", " + myCreation.data[0].content);
			this.emit('boardupdate', myCreation);
		}
	});
});