document.addEventListener("DOMContentLoaded",()=>{
let demoMode = 0;
let gameArea = document.getElementById("gameArea");
//gameArea.width = window.innerWidth-20;
//gameArea.height = window.innerHeight-20;
gameArea.width=800;
gameArea.height=600;
let context = gameArea.getContext("2d");
let tps = 60;
let loop = setInterval(tick,1000/tps);
let paddle ={
  x: gameArea.width/2,
  y: gameArea.height-20,
  width: 100,
  height:10
}
let ball = {
  x:gameArea.width/2,
  y:gameArea.height/2-50,
  size:10,
  speed:5,
  direction:300
}
let bricks = {
  x:[100,160,220,280,340,400,460,520,580,640,700
    ,100,160,220,280,340,400,460,520,580,640,700
    ,100,160,220,280,340,400,460,520,580,640,700],
  y:[20,20,20,20,20,20,20,20,20,20,20
    ,50,50,50,50,50,50,50,50,50,50,50
    ,80,80,80,80,80,80,80,80,80,80,80],
  damage:[1,1,1,2,2,2,2,2,1,1,1
         ,1,1,1,1,1,1,1,1,1,1,1
         ,1,1,1,1,1,1,1,1,1,1,1],
  width:50,
  height:15
}
function clear(){
  context.clearRect(0,0,gameArea.width,gameArea.height);
}
function tick(){
  clear();
  //Checks if all bricks are gone
  if(!bricks.damage.find((n)=>{return n!=0})){
    levelEnd();
  }
  updateBallLocation();
  if(demoMode==1){
    paddle.x =ball.x;
  }
  //draw paddle
  context.fillStyle = "#000000";
  context.fillRect(paddle.x-(paddle.width/2),paddle.y-(paddle.height/2),paddle.width,paddle.height);
  //draw ball
  context.beginPath();
  context.fillStyle = "#1b5e20";
  context.arc(ball.x, ball.y, ball.size, 0, 2 * Math.PI);
  context.fill();
  //draw bricks
  for(let i=0; i<bricks.x.length;i++){
    if(bricks.damage[i]>0){
      if(bricks.damage[i] == 1){
        context.fillStyle = "#b71c1c";
      }
      if(bricks.damage[i] == 2){
        context.fillStyle = "#0d47a1";
      }
      context.fillRect(bricks.x[i]-(bricks.width/2),bricks.y[i]-(bricks.height/2),bricks.width,bricks.height);
    }
  }
}
function updateBallLocation(){
  if(demoMode!=2){
    ball.x=ball.x+(ball.speed*Math.cos(ball.direction * Math.PI/180));
    ball.y=ball.y-(ball.speed*Math.sin(ball.direction * Math.PI/180));
  }
  checkBallCollison();
}
//Updates paddle x from mouse
document.addEventListener("mousemove",(e)=>{
  if(demoMode==2){
    ball.x=e.clientX;
    ball.y=e.clientY;
  }
  if(demoMode ==0) {
    paddle.x=e.clientX;

  }

})
function checkBallCollison(){
  //Left wall check
  if(ball.x<(0+ball.size)){
    bounce(90);

  }
  //Right wall check
  if(ball.x>(gameArea.width-ball.size)){
    bounce(90);
  }
  //Top wall check
  if(ball.y<(0+ball.size)){
    bounce(0);
  }
  //Bottom wall check
  if(ball.y>(gameArea.height-ball.size)){
    gameOver();
  }
  //Paddle Check
  if((ball.x>paddle.x-(paddle.width/2)-ball.size) && (ball.x<paddle.x+(paddle.width/2)+ball.size) && (ball.y>paddle.y-(paddle.height/2)-ball.size) && (ball.y<paddle.y+(paddle.height/2)+ball.size)){
    if(Math.pow((paddle.x - ball.x)/paddle.width,2)-Math.pow((paddle.y - ball.y)/paddle.height,2)<0){
      bounce(0);
    }
    else{
      bounce(90);
    }

  }
  for(let i = 0; i < bricks.x.length; i++){
    //inside brick
    if((bricks.damage[i] > 0) &&(ball.x>bricks.x[i]-(bricks.width/2)-ball.size) && (ball.x<bricks.x[i]+(bricks.width/2)+ball.size) && (ball.y>bricks.y[i]-(bricks.height/2)-ball.size) && (ball.y<bricks.y[i]+(bricks.height/2)+ball.size)){
      if(Math.pow((bricks.x[i] - ball.x)/bricks.width,2)-Math.pow((bricks.y[i] - ball.y)/bricks.height,2)<0){
        console.log("Brick Bounce 0 " +ball.x + " " + ball.y +" " + ball.direction);
        bounce(0);
      }
      else{
        console.log("Brick Bounce 90 " +ball.x + " " + ball.y +" " + ball.direction);
        bounce(90);
      }
      bricks.damage[i]--;
      break;
    }

  }
}

function bounce(wallDirection){
  ball.direction = (wallDirection *2)-ball.direction;
  if(ball.direction < 0){
    ball.direction = ball.direction + 360;
  }
  else if(ball.direction >360){
    ball.direction = ball.direction - 360;
  }
}
function levelEnd(){

  clearInterval(loop);
  clear();
  context.fillStyle = "#1b5e20";
  context.font = "30px Roboto";
  context.textAlign = "center";
  context.fillText("Level Clear!", gameArea.width/2, gameArea.height/2);
}
function gameOver(){
  clearInterval(loop);
  clear();
  context.fillStyle = "#b71c1c";
  context.font = "30px Roboto";
  context.textAlign = "center";
  context.fillText("Game Over!", gameArea.width/2, gameArea.height/2);
}
document.addEventListener("keypress",(e)=>{
  if(e.keyCode==49){
    demo(1);
  }
  if(e.keyCode==50){
    demo(2);
  }
});

function demo(n){
  demoMode = n;
  if(n==1){
    bricks.x=[100];
    bricks.y=[20];
    bricks.damage=[1];
    ball.x= 700;
    ball.y=200;
    ball.direction=230;
  }
}
});
