var socket = io();
var tileBoard;			//The canvas. Contains the context where we draw stuff.
var context;			//The image. From canvas.getContext; where we draw tiles.

var board;

var tileWidth = 16;		//Each tile is 16 by 16
var tileHeight = 16;
var rows;				//Number of rows. Length of the y axis.
var columns;			//Number of columns. Length of the x axis.

var tileImages;			//Array of images.
//0-8 correspond to neighbor counts on empty tiles
//9 and 10 are mine (also corresponds with tile)


$(document).ready(function(){
	//Initialize variables.
    console.log('jQuery has loaded.');

	tileBoard = document.getElementById("myCanvas");
	context = tileBoard.getContext("2d");

	
	tileImages = new Array(12);
	for(var i = 0; i < 11; i++)
	{
		tileImages[i] = new Image();
		tileImages[i].src = "/images/open" + i + ".gif";
	}
	tileImages[11] = new Image();
	tileImages[11].src = "/images/bombflagged.gif";
	
	
	//When we receive rows and columns from server, draw the grid.
    socket.on('settings', function (rows, cols, dataObject) {

        console.log("Settings: Rows: " + rows + ' Columns: ' + cols);
		
        board = new Array(cols);
		console.log("Board has " + board.length + " rows");
        for (var i = 0; i < cols; i++) {
            board[i] = new Array(rows);
        }
		
		this.rows = rows;
		this.columns = cols;
		tileBoard.width = tileWidth * cols;
		tileBoard.height = tileHeight * rows;
		tileBoard.style = "border:1px solid #000000;";


		var blankTile;
		blankTile = new Image();

		blankTile.onload = function (){
			console.log("Drawing first grid")
			drawGrid(tileBoard, this);
			console.log("First grid drawn");
			console.log("Drawing first tiles");
			boardUpdate(dataObject.data);
			console.log("First tiles drawn");
		};
		blankTile.src = "/images/blank.gif";
	});

	socket.on('boardupdate', function (args) {
		console.log("This is boardupdate");
		console.log("args.data.length = " + args.data.length);
		boardUpdate(args.data);
		console.log("Boardupdate done");
	});
	
	tileBoard.onclick = takeClick;

});

function boardUpdate(data)
{
	//data should be an array of Tiles
	for(var i = 0; i < data.length; i++)
	{
		drawTile(data[i]);
	}
}
	
function takeClick(mouseEvent)
{
	var x = mouseEvent.clientX;
	var y = mouseEvent.clientY;
	
	x -= this.offsetLeft;
	y -= this.offsetTop;
	
	x = Math.floor(x / tileWidth);
	y = Math.floor(y / tileHeight);
		
	//Check if the tile has not been revealed
	console.log("x: " + x + " y: " + y);
	
	if(mouseEvent.button === 0 && board[x][y] === undefined)
	{
		socket.emit('tileClick', x, y);		//Send x and y of tiles to server
	}
	else if(mouseEvent.button == 2)
	{
		if(board[x][y] == 11) {
            board[x][y] = undefined;
            context.drawImage(tileImages[0], x * tileWidth, y * tileHeight);
        } else if(board[x][y] === undefined) {
            board[x][y] = 11;
            context.drawImage(tileImages[11], x * tileWidth, y * tileHeight);
        }
	}
}

function drawTile(tile)
{
    board[tile.x][tile.y] = tile.content;
	context.drawImage(tileImages[tile.content], tile.x * tileWidth, tile.y * tileHeight);
}

function drawGrid(c, tile) 
{
	for(var y = 0; y < c.height; y += tileHeight) {		//Draw rows until all rows full
		for(var x = 0; x < c.width; x += tileWidth) {	//Draw tiles until row is full
			context.drawImage(tile, x, y);
		}
	}
}