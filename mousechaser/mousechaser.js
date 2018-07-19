class Chaser{
  constructor(startingX,startingY){
    this.position = [startingX,startingY];
    this.velocity = [0,0];
    this.acceleration = 0.1;
    this.uniqueMaxSpeed = maxChaseSpeed + Math.random()*5-2.5;
    this.acceleration = this.acceleration + Math.random()*0.3;
    this.chaserWidth = chaserWidth+(Math.random()*10-3);
    this.chaserHeight = this.chaserWidth;
  }
  getPosition(){
    return this.position;
  }
  updateChaser(){
    if(this.position[0]+this.chaserWidth/2 < mouseX){
      if(this.velocity[0] < this.uniqueMaxSpeed){
        this.velocity[0] += this.acceleration;
      }
    }
    if(this.position[0]+this.chaserWidth/2 > mouseX){
      if(this.velocity[0] > -this.uniqueMaxSpeed){
        this.velocity[0] -= this.acceleration;
      }
    }
    if(this.position[1]+this.chaserHeight/2 < mouseY){
      if(this.velocity[1] < this.uniqueMaxSpeed){
        this.velocity[1] += this.acceleration;
      }
    }
    if(this.position[1]+this.chaserHeight/2 > mouseY){
      if(this.velocity[1] > -this.uniqueMaxSpeed){
        this.velocity[1] -= this.acceleration;
      }
    }

    this.position[0] += this.velocity[0];
    this.position[1] += this.velocity[1];

    canvasContext.fillStyle = "red";
    canvasContext.fillRect(this.position[0],this.position[1],this.chaserWidth,this.chaserHeight);
  }
  checkCollision(){
    if(this.position[1]+this.chaserHeight >= windowHeight || this.position[1] <= 0){
      this.velocity[1] = 0;
    }
    if(this.position[0]+this.chaserWidth >= windowWidth || this.position[0] <= 0){
      this.velocity[0] = 0;
    }
    if(this.position[1]<=mouseY && this.position[1]+this.chaserHeight>=mouseY && this.position[0]<=mouseX && this.position[0]+this.chaserWidth>=mouseX){
      playing = false;
      winning = false;
      loserImage();
    }
  }
}
var framesPerSecond = 120;
var playing = false;
var canvas;
var canvasContext;
var chaserX = 50;
var chaserY = 50;
var mouseX;
var mouseY;
var chaseSpeed = 1.0;
var chaserWidth = 10;
var chaserHeight = 10;
var maxChaseSpeed = 3;
var elapsedTime = 0.0;
var windowWidth = 0;
var windowHeight = 0;
var score = -1;
var chasers = [];
var winning = true;

window.onload = function() {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
  canvasContext.canvas.width  = windowWidth;
  canvasContext.canvas.height = windowHeight;
  canvas.addEventListener("mousemove",function(evt){
    calculateMousePos(evt)}
  );
  canvas.addEventListener("click",function(){
    pause()}
  );
  gameSetup();
  canvasContext.font = "120px Comic Sans";
  canvasContext.fillStyle = "white";
  canvasContext.fillText("Avoid the boxes.",windowWidth/3,windowHeight/3);
  canvasContext.fillText("Click to begin the game.",windowWidth/4,windowHeight/3+120);
  canvasContext.font = "60px Comic Sans";
  canvasContext.fillText("(Click during the game to increase intensity.)",windowWidth/3.7,windowHeight/3+195);
  setInterval(gameUpdate, 1000/framesPerSecond);
}

function reset(){
  gameSetup();
  canvasContext.font = "120px Comic Sans";
  canvasContext.fillStyle = "white";
  canvasContext.fillText("Avoid the boxes.",windowWidth/3,windowHeight/3);
  canvasContext.fillText("Click to begin the game.",windowWidth/4,windowHeight/3+120);
  canvasContext.font = "60px Comic Sans";
  canvasContext.fillText("(Click during the game to increase intensity.)",windowWidth/3.7,windowHeight/3+195);

  chasers = []
  score = 0.0;
  winning = true;
}

function calculateMousePos(evt){
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  mouseX = evt.clientX - rect.left - root.scrollLeft;
  mouseY = evt.clientY - rect.top - root.scrollTop;
}

function loserImage() {
  var img = new Image();
  img.onload = function () {
    canvasContext.drawImage(img, windowWidth/2-175, windowHeight/2-175);
  }
  img.src = "https://3.bp.blogspot.com/-BsxgPoShd_c/V-gjlSdEVnI/AAAAAAAATHY/fa9IfS2DYFI5XhyjFoCcaml-JH0IqwW9gCLcB/s1600/so-sad-emoji.png";
}

function pause(){
  if(winning){
    playing = true;
    for(i = 0;i<10;i++){
      chasers.push(new Chaser(Math.floor((Math.random() * windowWidth) + 1),Math.floor((Math.random() * windowHeight) + 1)));
    }
    score += 10;
  }
  else{
    reset();
  }
}

function gameSetup() {
  canvasContext.fillStyle = "black";
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
}

function update(){
    for(i=0;i<chasers.length;i++){
      chasers[i].checkCollision();
      chasers[i].updateChaser();
    }
    canvasContext.font = "30px Comic Sans";
    canvasContext.fillStyle = "white";
    canvasContext.fillText(Math.floor(score)+"pts",10,50);
    score += 1/framesPerSecond;
}

function gameUpdate(){
  if(playing){
    gameSetup();
    update();
    elapsedTime += 1000/framesPerSecond;
    if(elapsedTime > 1000){
      chasers.push(new Chaser(Math.floor((Math.random() * windowWidth) + 1),Math.floor((Math.random() * windowHeight) + 1)))
      elapsedTime = 0;

    }
  }
}
