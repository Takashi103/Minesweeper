var socket = io();
var tileBoard;			//The canvas. Contains the context where we draw stuff.
var context;			//The image. From canvas.getContext; where we draw tiles.

var tileWidth = 16;		//Each tile is 16 by 16
var tileHeight = 16;
var rows;				//Number of rows. Length of the y axis.
var columns;			//Number of columns. Length of the x axis.

var tileImages;			//Array of images.
//0-8 correspond to neighbor counts on empty tiles
//9 and 10 are mines (also corresponds with tile)

$(document).ready(function(){
	//Initialize variables.
    console.log('jQuery has loaded.');

	tileBoard = document.getElementById("myCanvas");
	context = tileBoard.getContext("2d");

	tileImages = new Array(11);
	for(var i = 0; i < tileImages.length; i++)
	{
		tileImages[i] = new Image();
		tileImages[i].src = "/images/open" + i + ".gif";
	}
	
	//When we receive rows and columns from server, draw the grid.
    socket.on('settings', function (rows, cols) {
        console.log("Rows: " + rows + ' Columns: ' + cols);
		this.rows = rows;
		this.columns = cols;
		tileBoard.width = tileWidth * cols;
		tileBoard.height = tileHeight * rows;
		tileBoard.style = "border:1px solid #000000;";


		var blankTile;
		blankTile = new Image();

		blankTile.onload = function (){
			drawGrid(tileBoard, this);
		};
		blankTile.src = "/images/blank.gif";

	});

	socket.on('boardupdate', function (args) {
		console.log("This is boardupdate");
		console.log("args.data.length = " + args.data.length);
		var data = args.data;	//data should be an array of Tiles
		for(var i = 0; i < data.length; i++)
		{
			drawTile(data[i]);
			//if(data[i].content == 9)
				//it's a mine; lose points
		}
		
	});
	
	tileBoard.onclick = takeClick;

});
	
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
	//if(true)  //Except, at this point, there is no reveal. :/
	socket.emit('tileClick', x, y);		//Send x and y of tiles to server
}

function drawTile(tile)
{
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
