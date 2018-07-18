
alert("            Breakout\nred powerup = length\ngold powerup = extra ball\nClick/Tap to deploy balls");

var mouseX = window.innerWidth/2
var framesPerSecond = 60;
var paddle = {yPaddlePos:window.innerHeight-window.innerHeight/30,width:window.innerWidth/8,height:window.innerHeight/50,widthMax:window.innerWidth/4};
var colors = ["#2e4053","#7d3c98","#ba4a00","#d4ac0d","#17a589","#2e86c1"];
var blocks = [];
var blockData = {height:window.innerHeight/30,width:window.innerWidth/15};
balls = [];
powerups = [];
deaths = 0;
var celebrated= false;


if(window.innerHeight > window.innerWidth){
  paddle.yPaddlePos -= (window.innerHeight/30)*4;
  paddle.width *= 1.5
  blockData.width = window.innerWidth/8;
}

class ball{
  constructor(xPos,yPos){
    this.xPos = xPos;this.xVel = 0;this.yVel=0;this.moving = false;this.radius = 7;
    this.yPos = yPos-this.radius;
    this.xVelMax = 6-deaths; this.yVelMax = 9-deaths;
  }
  drawBall(mouseX){
    ctx.fillStyle = "silver";
    ctx.beginPath();
    if(this.moving == false){
      this.xPos = mouseX;
      ctx.arc(this.xPos, this.yPos, this.radius, 0, 2 * Math.PI);
    }
    else{
      ctx.arc(this.xPos, this.yPos, this.radius, 0, 2 * Math.PI);
    }
    ctx.fill();
  }
  activateBall(){
    if(this.moving == false){
      this.moving = true;
      this.xVel = 6*Math.random()-3;
      this.yVel = -window.innerHeight/70;
    }
  }
  updateBall(blocks,yPaddlePos){
    for (var k = 0; k<blocks.length; k++){
      if(blocks[k].checkCollision(this.radius,this.xPos+this.xVel,this.yPos+this.yVel)){
        this.yVel = -this.yVel;
        blocks[k].destroy();
        blocks.splice(k, 1);
        break;
      }
    }
    if(this.yPos > yPaddlePos - 10 && this.moving){
      if(this.yPos+this.yVel >= yPaddlePos && this.yPos+this.yVel <= yPaddlePos+2*(window.innerHeight/80) && this.xPos <= mouseX+paddle.width/2 && this.xPos >= mouseX-paddle.width/2){
        var strength = (mouseX-this.xPos)/(paddle.width/2);
        var bounceAngle = strength*((5*3.14)/12);
        console.log(strength,bounceAngle);
        this.yVel = -1*this.yVelMax*Math.cos(bounceAngle);
        this.xVel = -1*this.xVelMax*Math.sin(bounceAngle);
      }
    }
    if(this.xPos < 100){
      if(this.xPos+this.xVel < 0){
        this.xVel = -this.xVel;
      }
    }
    if(this.yPos < 20){
      if(this.yPos+this.yVel < 0){
        this.yVel = -this.yVel;
      }
    }
    if(this.xPos > window.innerWidth - 100){
      if(this.xPos + this.xVel > window.innerWidth){
        this.xVel = -this.xVel;
      }
    }
    if(Math.abs(this.xVel) > this.xVelMax){
      if(this.xVel<0){this.xVel = -this.xVelMax;}
      else{this.xVel = this.xVelMax};
    }
    if(Math.abs(this.yVel) > this.yVelMax){
      if(this.yVel<0){this.yVel = -this.yVelMax;}
      else{this.yVel = this.yVelMax};
    }
    this.yPos += this.yVel;
    this.xPos += this.xVel;
  }
  getYPos(){
    return this.yPos;
  }
}

class powerupItem{
  constructor(xPos,yPos,type){
    this.xPos = xPos;this.yPos = yPos;this.yVel = window.innerHeight/240;this.radius = window.innerWidth/100;
    this.type = type;
  }
  checkCollision(mouseX,yPaddlePos){
    if(this.yPos > yPaddlePos - 10){
      if(this.yPos+this.yVel >= yPaddlePos && this.yPos+this.yVel <= yPaddlePos+2*(window.innerHeight/80) && this.xPos <= mouseX+paddle.width/2 && this.xPos >= mouseX-paddle.width/2){
        return [true,this.type];
      }
    }
    return [false,this.type];
  }
  drawPowerupItem(){
    if(this.type == "bonusball"){
      ctx.fillStyle = "gold";
    }
    if(this.type == "long"){
      ctx.fillStyle = "red";
    }
    ctx.beginPath();
    ctx.arc(this.xPos, this.yPos, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
  updatePowerupItem(){
    this.yPos += this.yVel;
  }
}

class block{
  constructor(xPos,yPos,color,width,height){
    this.xPos = xPos;this.yPos = yPos;this.color = color;this.width = width; this.height = height;
    this.halfWidth = this.width/2;this.halfHeight = this.height/2;
  }
  drawBlock(){
    ctx.fillStyle = "black";
    ctx.fillRect(this.xPos,this.yPos,this.width,this.height);
    ctx.fillStyle = this.color;
    ctx.fillRect(this.xPos+1,this.yPos+1,this.width-2,this.height-2);
  }
  checkCollision(radius,circleX,circleY){
    var distX = Math.abs(circleX - (this.xPos + this.width / 2));
    var distY = Math.abs(circleY - (this.yPos + this.height / 2));
    if (distX > this.halfWidth + radius || distY > this.halfHeight + radius)
    {return false}
    if (distX <= this.halfWidth || distY <= this.halfHeight)
    {return true}
  }
  destroy(){
    if(Math.random()<0.5){
      if(Math.random()>0.5){
        powerups.push(new powerupItem(this.xPos+this.halfWidth,this.yPos,"bonusball"));
      }
      else{
        powerups.push(new powerupItem(this.xPos+this.halfWidth,this.yPos,"long"));
      }
    }
  }
}

window.onload = function() {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  ctx.canvas.width  = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  gameSetup();
  gameRender();
  canvas.addEventListener("mousemove",function(evt){calculateMousePos(evt)});
  canvas.addEventListener("touchmove",function(evt){calculateMousePosFromTouch(evt)});
  canvas.addEventListener("click",function(){click();});
  setInterval(update, 1000/framesPerSecond);
}

function click(){
  for(var i = 0;i<balls.length;i++){
    balls[i].activateBall();
  }
}

function calculateMousePos(evt){
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  mouseX = evt.clientX - rect.left - root.scrollLeft;
}

function calculateMousePosFromTouch(evt){
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  mouseX = evt.changedTouches[0].pageX - rect.left - root.scrollLeft;
}

function gameSetup(){
  var blocksNumberAcross = window.innerWidth/(blockData.width);
  var blocksNumberDown = (window.innerHeight/3)/(blockData.height);
  var currentColor;
  for(var j = 0;j<blocksNumberDown;j++){
    for(var i = 0;i<blocksNumberAcross;i++){
      currentColor = colors[Math.floor(Math.random()*colors.length)];
      blocks.push(new block(i*blockData.width,window.innerHeight/20+j*blockData.height,currentColor,blockData.width,blockData.height));
    }
  }
  balls.push(new ball(mouseX-paddle.width/2,paddle.yPaddlePos))
}

function update(){
  for(var v =0;v<balls.length;v++){
    balls[v].updateBall(blocks,paddle.yPaddlePos);
    if(balls[v].getYPos() > window.innerHeight){
      balls.splice(v,1);
    }
  }
  for(var v = 0;v<powerups.length;v++){
    powerups[v].updatePowerupItem();
    if(powerups[v].checkCollision(mouseX,paddle.yPaddlePos)[0]){
      if(powerups[v].checkCollision(mouseX,paddle.yPaddlePos)[1] == "bonusball"){
        balls.push(new ball(mouseX-paddle.width/2,paddle.yPaddlePos));
      }
      if(powerups[v].checkCollision(mouseX,paddle.yPaddlePos)[1] == "long"){
        if(paddle.width < paddle.widthMax){
          paddle.width *= 1.07;
        }
      }
      powerups.splice(v,1);
    }
  }
  gameRender();
  if(balls.length == 0){
    blocks = [];
    powerups = [];
    gameSetup();
    gameRender();
    if(deaths <= 4){
      deaths += 1;
    }
  }
  if(blocks.length == 0 && !celebrated){
    celebrated = true;
    for(var i =0;i<50;i++){
      balls.push(new ball(Math.random()*window.innerWidth,Math.random()*window.innerHeight));
    }
    click();
    }
  }

function gameRender(){
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = "white";
  ctx.fillRect(mouseX-paddle.width/2,paddle.yPaddlePos,paddle.width,paddle.height);
  for(var i = 0;i < blocks.length; i++){
    blocks[i].drawBlock();
  }
  for(var i = 0;i< balls.length; i++){
    balls[i].drawBall(mouseX);
  }
  for(var i = 0;i < powerups.length; i++){
    powerups[i].drawPowerupItem();
  }
}
