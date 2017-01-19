window.onload = function() {

    socket = io.connect('http://localhost:3000');
    var blankTile;
    blankTile = new Image();
        
    //I had some problems with the code rolling forwards without the image loading first.
    //The image size would be returned as zero, and the code would try to draw infinite tiles.
    //And that's bad.
        
    //This sets it up so's the drawGrid method gets called once the image FINISHES loading.
    blankTile.onload = function (){
        //Obviously, the first argument is the canvas, and the second is the image itself.
        drawGrid(document.getElementById("myCanvas"), this);
    };
    //Load the image. onLoad() is triggered once the image is present, and calls drawGrid().
    blankTile.src = "/images/blank.gif";
};
function drawGrid(c, tile) 
{
    //console.log("drawGrid has been called");
    var tileWidth = tile.naturalWidth;
    var tileHeight = tile.naturalHeight;
    
    //These can tell you if the image is loaded or not.
    //If you're having problems with missing tiles, uncomment them and check that they're not zero or whatever.
    //console.log("tileWidth is " + tileWidth);
    //console.log("tileHeight is " + tileHeight);
    
    context = c.getContext("2d");

    for(var y = 0; y < c.height; y += tileHeight) {     //Draw rows until all rows full
        for(var x = 0; x < c.width; x += tileWidth) {   //Draw tiles until row is full
            context.drawImage(tile, x, y);
        }
    }
    //console.log("drawGrid has closed successfully");
}
