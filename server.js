
/*
Takashi: js file for server
*/
//Declare variables here.
var rows = 10;
var cols = 10;
var mines = 30;
var board;			//These are intialized together
var tileFlipper;	//This takes a reference to an initialized board

//I don't know what this does but it doesn't work when I remove it
var express = require('express');
var app = express();

app.use(express.static('public'));

var server = app.listen(3000, function(){
	console.log('listening on port 3000');
});

var io = require('socket.io')(server);

//--------------------------------------------



board = new Array(cols);
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

tileFlipper = new revealStack(cols, rows, board)

for (var i = 0; i < cols; i++) {
	for (var j = 0; j < rows; j++) {
		if(board[i][j].content != 9) {

			var sum = 0;
			var adjacentContent = nearbyMines(i, j);

			for (var k = 0; k < adjacentContent.length; k++) {
				if(adjacentContent[k] == 9)
					sum++;
			}
			board[i][j].content = sum;
		}
	}
}

function nearbyMines(x, y) {
	var mineCount = 0;
	var tiles = new Array;
	//Row above
	inBounds(x - 1, y - 1);
	inBounds(x, y - 1);
	inBounds(x + 1, y - 1);
	//Left and right
	inBounds(x - 1, y);
	inBounds(x + 1, y);
	//Row below
	inBounds(x - 1, y + 1);
	inBounds(x, y + 1);
	inBounds(x + 1, y + 1);
	function inBounds(x, y) {
	//Check that the tile is on the board
		if(x >= 0 && y >= 0 && x < cols && y < rows)
			tiles.push(board[x][y].content);
	}
	return tiles;
}


io.on('connection', function(socket){
	console.log('new user connected with id: ' + socket.id);
	socket.emit('settings', rows, cols);
	socket.on('tileClick', function(x, y) {
		console.log('Click recieved at: ' + x +', ' + y + ', Content = ' + board[x][y].content);
		var revealedTiles = tileFlipper.bigReveal(board[x][y]);
		socket.emit('boardupdate', {data: revealedTiles});
	});
});

function Tile(x, y, content) {
	this.x = x;
	this.y = y;
	this.content = content;
	this.revealed = false;
}





//Supposed to return an object for revealing a contiguous block of blank tiles
function revealStack(cols, rows, board) {

	this.cols = cols;
	this.rows = rows;
	this.board = board;					//The complete set of tiles. It's a two-level array.

	var tileQueue = [];					//List of tiles to reveal

	//This is apparently how you make private methods in JavaScript:
	//var methodName = function(parameters) {doStuff;};
	
	//Reveals the center tile, then the things around it. Reveals even if the first tile is
	//a mine. Also, because the tile.reveal value gets set independent of calls to the revealMethod,
	//interrupting this method may leave tiles marked as revealed without actually showing them
	//using revealMethod().
	this.bigReveal = function(workingTile) {
		
		console.log("bigReveal!");
		//Start working with the first tile. If it's not valid for the clicky-clicky, pushTile()
		//won't add it to the tileQue and we'll just skip the loop.
		var revealedMines = [];
		pushTile(workingTile.x, workingTile.y);
		//Loop: take a tile off the bottom of the array. Maybe put some tiles on top.
		//Lather, rinse, repeat.
		while(tileQueue.length > 0)
		{
			//Pull the next item from the que.
			//In JavaScript, shift removes the first item in the array.
			workingTile = tileQueue.shift();
			//If it's a blank tile, mark nearby tiles to reveal.
			//Note: pushTile automatically excludes tiles off the board and tiles already shown.
			if(workingTile.content == 0)
				pushAbout(workingTile.x, workingTile.y);
			//Reveal the tile. Assume revealMethod has been set to make the mine show up onscreen,
			//make the server ping the users, etc. etc.
			revealedMines.push(workingTile);
		}
		
		return revealedMines;
	};

	//I could use nested for-loops for this but that's hard and I'm lazy.
	//Calls pushTile, which checks for us if the tile is already marked or out of range.
	var pushAbout = function(x, y) {
		//Row above
		pushTile(x - 1, y - 1);
		pushTile(x, y - 1);
		pushTile(x + 1, y - 1);
		//Left and right
		pushTile(x - 1, y);
		pushTile(x + 1, y);
		//Row below
		pushTile(x - 1, y + 1);
		pushTile(x, y + 1);
		pushTile(x + 1, y + 1);		
	};

	var pushTile = function(x, y){
		console.log("Push tile " + x + ", " + y);
		//Check that the tile is on the board.
		if(x >= 0 && y >= 0 && x < cols && y < rows)
		{
			//Get the tile object from the board.
			var tile = board[x][y];
			//Check that the tile is not already in the que.
			if(!tile.revealed)
			{
				tile.revealed = true;	//Mark that the tile is being added to the que.
				tileQueue.push(tile);	//Add it to the end of the array.
			}
		}
	};
}