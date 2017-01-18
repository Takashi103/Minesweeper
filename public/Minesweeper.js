/* MauveRanger
Supposed to be the main code for the game. I have no idea how to do this.
*/

var rows = 10;
var cols = 10;
var array = [];

for (var j = 0; j < rows; j++) {
	for (var i = 0; i < cols; i++) {
    	var tile = new tile(i, j);
    	array.push(tile);
	}
}
current = grid[0];

function tile(i, j) {
  this.i = i;
  this.j = j;
  this.isMine = false;
}

function setup() {
	socket = io.connect('http://localhost:3000')
}

function draw() {

}
