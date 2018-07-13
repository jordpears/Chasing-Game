upperBorder = 0.1*window.innerHeight;
lowerBorder = 0.2*window.innerHeight; //minimum borders for game
sideBorder = 0.05*window.innerWidth;

darkboard = document.getElementById('darkboard'); //background squares
lightboard = document.getElementById('lightboard');

function Chessboard(){
  this.gameState = ["cb","hb","bb","qb","kb","bb","hb","cb",
                    "p1b","p1b","p1b","p1b","p1b","p1b","p1b","p1b",
                    "","","","","","","","",
                    "","","","","","","","",
                    "","","","","","","","",
                    "","","","","","","","",
                    "p1w","p1w","p1w","p1w","p1w","p1w","p1w","p1w",
                    "cw","hw","bw","qw","kw","bw","hw","cw"];

  this.boardPositions = [];

  this.pieceClicked = -1; //no piece clicked

  this.setupBoardPositions = function() {
    var across = 0;
    for(i = 0;i<8*8;i++){
      var pos = [pieceSize*across,pieceSize*Math.floor(i/8)];
      across += 1;
      if(across == 8){
        across = 0;
      }
      this.boardPositions.push(pos);
    }
  }

  this.drawState = function() {
    //print the board first
    var across = 0;
    var alternate = true;
    for(i = 0;i<8*8;i++){
      if(alternate){
          ctx.drawImage(lightboard,pieceSize*across,pieceSize*Math.floor(i/8),pieceSize,pieceSize);
          if(across != 7){
            alternate = false;
          }
      }
      else{
        ctx.drawImage(darkboard,pieceSize*across,pieceSize*Math.floor(i/8),pieceSize,pieceSize);
        if(across != 7){
          alternate = true;
        }
      }
      across += 1;
      if(across == 8){
        across = 0;
      }
    }
    //now print pieces
    var across = 0;
    var alternate = true;
    for(i = 0;i<8*8;i++){
      if(this.gameState[i] != ""){
        ctx.drawImage(document.getElementById(this.gameState[i]),pieceSize*across,pieceSize*Math.floor(i/8),pieceSize,pieceSize);
      }
      across += 1;
      if(across == 8){
        across = 0;
      }
    }
  }

  this.clicked = function(mouseX,mouseY){
    var xFound,yFound = false;
    for(i = 0;i<this.boardPositions.length;i++){
      if(mouseX < this.boardPositions[i][0] + pieceSize && mouseX > this.boardPositions[i][0] && !xFound){
        var xPos = i;
        xFound = true;
      }
      if(mouseY < this.boardPositions[i][1] + pieceSize && mouseY > this.boardPositions[i][1] && !yFound){
        var yPos = Math.floor(i/8);
        yFound = true;
      }
    }
    var arrayLocation = yPos*8+xPos;
    if(this.pieceClicked == -1){
      if(this.gameState[arrayLocation] != ""){
          this.pieceClicked = arrayLocation;
          ctx.beginPath();
          ctx.lineWidth="3";
          ctx.strokeStyle="red";
          ctx.rect(pieceSize*xPos,pieceSize*yPos,pieceSize,pieceSize);
          ctx.stroke();
          xPosOld = xPos;
          yPosOld = yPos;
      }
    }
    else{
      if(arrayLocation == this.pieceClicked){
        this.pieceClicked = -1;
        this.drawState();
      }
      else {
      this.movePiece(arrayLocation,xPos,yPos,xPosOld,yPosOld);
      }
    }
  }

  this.movePiece = function(moveTo,xPos,yPos,xPosOld,yPosOld){ //verify move
    var abort = false;
    var pieceAtMoveTo = this.gameState[moveTo];
    var pieceToMove = this.gameState[this.pieceClicked];
    distanceMovedX = xPosOld - xPos;
    distanceMovedY = yPosOld - yPos;
    console.log(pieceToMove.slice(0,-1));
    //piece verification
    switch(pieceToMove.slice(0, -1)){

      case "p1":
        if(pieceAtMoveTo != ""){
          if(distanceMovedY <= 1 && distanceMovedY > 0 && Math.abs(distanceMovedX) == 1){
            this.gameState[this.pieceClicked] = this.gameState[this.pieceClicked].slice(0,1) + this.gameState[this.pieceClicked].slice(2);
            break;
          }
        }
        if(distanceMovedY <= 2 && distanceMovedY > 0 && distanceMovedX == 0){
          this.gameState[this.pieceClicked] = this.gameState[this.pieceClicked].slice(0,1) + this.gameState[this.pieceClicked].slice(2);
          break;
        }
        abort = true;
      case "p":
        if(pieceAtMoveTo != ""){
          if(distanceMovedY <= 1 && distanceMovedY > 0 && Math.abs(distanceMovedX) == 1){
            break;
          }
        }
        if(distanceMovedY <= 1 && distanceMovedY > 0 && distanceMovedX == 0 && pieceAtMoveTo == ""){
          break;
        }
        abort = true;
      case "c":
        if((Math.abs(distanceMovedX) > 0 && distanceMovedY == 0) || (Math.abs(distanceMovedY) > 0 && distanceMovedX == 0)){
          break;
        }
        abort = true;
      case "h":
        if((Math.abs(distanceMovedX) == 1 && Math.abs(distanceMovedY) == 2) || (Math.abs(distanceMovedX) == 2 && Math.abs(distanceMovedY) == 1)){
          break;
        }
        abort = true;
      case "b":
        if(Math.abs(distanceMovedX) == Math.abs(distanceMovedY)){
          break;
        }
        abort = true;
      case "q":
        if(Math.abs(distanceMovedX) == Math.abs(distanceMovedY) || ((Math.abs(distanceMovedX) > 0 && distanceMovedY == 0) || (Math.abs(distanceMovedY) > 0 && distanceMovedX == 0))){
          break;
        }
        abort = true;
      case "k":
        if(Math.abs(distanceMovedX) <= 1 && Math.abs(distanceMovedY) <= 1){
          break;
        }
        abort = true;
    }

    //check for collision
    for

    if(!abort) {
      this.gameState[moveTo] = this.gameState[this.pieceClicked];
      this.gameState[this.pieceClicked] = "";
      this.pieceClicked = -1;
      this.drawState();
    }
    else{
      this.pieceClicked = -1;
      this.drawState();
    }
  }

  //"contructor"
  this.setupBoardPositions();
  //"constructor"
}

window.onload = function() {

  var pieceSizeWidth = (window.innerWidth-sideBorder*2)/8.0;
  var pieceSizeHeight = (window.innerHeight-lowerBorder-upperBorder)/8.0;
  pieceSize = Math.min(pieceSizeWidth,pieceSizeHeight);
  sideBorder = (window.innerWidth - pieceSize*8)/2;

  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  ctx.canvas.width  = pieceSize*8;
  ctx.canvas.height = pieceSize*8;
  canvas.style.top = upperBorder + "px";
  canvas.style.left = sideBorder + "px";
  canvas.style.width = pieceSize*8 + "px";
  canvas.style.height = pieceSize*8 + "px";

  canvas.addEventListener("click",function(event){onClick(event);}); //set up click event listener

  board = new Chessboard();
  board.drawState();
}

function onClick(event){
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  mouseX = event.clientX - rect.left - root.scrollLeft;
  mouseY = event.clientY - rect.top - root.scrollTop ;
  board.clicked(mouseX,mouseY);

}
