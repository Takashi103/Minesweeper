var socket = io();
var tileBoard;
var tileWidth = 16;
var tileHeight = 16;
var rows;
var columns;

$(document).ready(function(){
	//Initialize variables.
    console.log('jQuery has loaded.');

	tileBoard = document.getElementById("myCanvas");

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
	if(true)  //Except, at this point, there is no reveal. :/
		socket.emit('tileClick', x, y);		//Send x and y of tiles to server
}

function drawGrid(c, tile) 
{
	context = c.getContext("2d");

	for(var y = 0; y < c.height; y += tileHeight) {		//Draw rows until all rows full
		for(var x = 0; x < c.width; x += tileWidth) {	//Draw tiles until row is full
			context.drawImage(tile, x, y);
		}
	}
}