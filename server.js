/*
Takashi: js file for server
*/
//Declare variables here.
var rows = 10;
var cols = 10;
var mines = 30;
var board;

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
			console.log("bombtile clicked at: " + myCreation.data[0].x + ", " + myCreation.data[0].y + ", " + myCreation.data[0].content);
			this.emit('boardupdate', myCreation);
		}
	});
});

function Tile(x, y, content) {
	this.x = x;
	this.y = y;
	this.content = content;
}








/*revealStack class definition
untested

I know JavaScript is a little more about functional and imperative programming than
object oriented, but this is kind of complex and the encapsulation will do me good, I think.
More experienced programmers may note that I'm not taking advantage of js's automatic
variable-recording-at-time-of-call thingy or whatever. I don't know what that is.
Maybe later.

revealStack is an object intended to control revealing an area with contiguous blank tiles.
Build an artificial stack using an array. New tiles are added at the end of the array,
while tiles are revealed from the beginning of the array. This keeps the the maximum
"stack" size down to the perimeter of the tileBoard, rather than its area, avoiding stack
overflow with larger boards.

To visualize it, the old, recursive way is a snake that reaches
out to a corner, the follows the walls until it gets stuck, and
each tile is another level on the stack, which is only redacted
once the head of the snake gets stuck. That's a lot of
recursion!

The new way, based on making an array to represent unfinished business,
is like water blooming outwards from the first tile. It hits the center,
and only the boundary is recorded, forgetting the middle. It maintains a
stack only as large as the perimeter of the spill. That's about O(n^0.5).
*/

//Supposed to return an object for revealing a contiguous block of blank tiles
//                  (int,   int,    Tile[][], function )
function revealStack(width, height, board, revealMethod) {
	this.width = width;
	this.height = height;
	this.board = board;

	var revealMethod = revealMethod;	//External method that we call to reveal a given tile.
	var tileStack = [];	//List of tiles to reveal

	//This is apparently how you make private methods in JavaScript:
	//var methodName = function(parameters) {doStuff;};
	
	//Reveals the center tile, then the things around it. Reveals even if the first tile is
	//a mine. Also, because tile.reveal gets set independent of calls to the revealMethod,
	//interrupting this method may leave tiles marked as revealed without actually showing them
	//according to revealMethod().
	this.bigReveal = function(workingTile) {
		//Start working with the first tile. If it's not valid for the clicky-clicky, pushTile()
		//won't add it to the tileStack and we'll just skip the loop.
		pushTile(workingTile);
		//Loop: take a tile off the bottom of the array. Maybe put some tiles on top.
		//Lather, rinse, repeat.
		while(tilestack.length > 0)
		{
			//Pull the next item from the stack
			workingTile = tileStack.shift;
			//If it's a blank tile, mark nearby tiles to reveal.
			//Note: pushTile automatically excludes tiles off the board and tiles already shown.
			if(workingTile.content == 0)
				pushAbout(workingTile.x, workingTile.y);
			//Reveal the tile. Assume revealMethod has been set to make the mine show up onscreen,
			//make the server ping the users, etc. etc.
			revealMethod(workingTile);
		}
	};
	//I could use nested for-loops for this
	//but that's hard and I'm lazy
	//Calls pushTile, which checks for us if the tile is marked or out of range.
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
		//Check that the tile is on the board
		if(x >= 0 && y >= 0 && x < width && y < height)
		{
			var tile = board[x][y];
			//Check that the tile is not already on the stack
			if(!tile.revealed)
			{
				//Mark that the tile is being added to the stack
				tile.revealed = true;
				tileStack.push(tile);	//Add it to the end of the array
			}
		}
	};
}
