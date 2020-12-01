import Player from './Player.mjs';
import Collectible from './Collectible.mjs';
//const io = require('socket.io-client');

const socket = io();
const canvas = document.getElementById('game-window');
const ctx = canvas.getContext('2d');
var p,c;
socket.on('connect', () => {
p = new Player({ x: 320, y: 240, score: 0, id: socket.id })
c = new Collectible({ x: 20, y: 40, value: 1, id: socket.id })

socket.emit('newPlayer',p,c);
//First Collectible Created
drawCollectible(c);
});


var image = new Image(50,50);
image.src = '/public/img/reaper.png';
var c_image = new Image(30,30);
c_image.src = '/public/img/skull.png';
var c2_image = new Image(30,30);
c2_image.src = '/public/img/keyskull.png';
var c3_image = new Image(30,30);
c3_image.src = '/public/img/tripleskull.png';


const drawCollectible = (col) => {
 
  if (col.value==1) ctx.drawImage(c_image,  col.x,  col.y, 30,30);
  else if (col.value==2) ctx.drawImage(c2_image,  col.x,  col.y, 30,30);
  else ctx.drawImage(c3_image,  col.x,  col.y, 30,30);
  
}
var scorediv = document.querySelector('#score');




socket.on('state', (gameState) => {
  let playerslist=[];
  for (let player in gameState.players) {
    if (player == socket.id) drawPlayer(gameState.players[player]);
    playerslist.push(gameState.players[player])
  }
  //drawPlayer(gameState.players[socket.id])
  for (let collectible in gameState.collectibles) {
    if (collectible == socket.id) drawCollectible(gameState.collectibles[collectible]);
  }
  scorediv.innerHTML ="Score : " +  p.score  + "    " + p.calculateRank(playerslist);
})


const drawPlayer = (player) => {  
  ctx.clearRect(0,0,640,480)
  p.x=player.x;
  p.y=player.y;
  p.score=player.score;
  ctx.drawImage(image,  player.x,  player.y, player.width, player.height);
  if (p.collision(c)) {
    c = getCollectible() // Create New Collectible
    
    socket.emit('collision', c);
  }
}

const getCollectible = () => {  
  var randomx = Math.floor(Math.random() * 610);
  var randomy = Math.floor(Math.random() * 450);
  var randomvalue = Math.floor(Math.random() * 3) + 1;
  return new Collectible({ x: randomx, y: randomy, value: randomvalue, id: Date.now() })
}


const playerMovement = {
  up: false,
  down: false,
  left: false,
  right: false
};

const keyDownHandler = (e) => {
  if (e.keyCode == 39 || e.keyCode == 68) {
    playerMovement.right = true;
  } else if (e.keyCode == 37 || e.keyCode == 65) {
    playerMovement.left = true;
  } else if (e.keyCode == 38 || e.keyCode == 87) {
    playerMovement.up = true;
  } else if (e.keyCode == 40 || e.keyCode == 83) {
    playerMovement.down = true;
  }
};

const keyUpHandler = (e) => {  
  if (e.keyCode == 39 || e.keyCode == 68) {
    playerMovement.right = false;
  } else if (e.keyCode == 37 || e.keyCode == 65) {
    playerMovement.left = false;
  } else if (e.keyCode == 38 || e.keyCode == 87) {
    playerMovement.up = false;
  } else if (e.keyCode == 40 || e.keyCode == 83) {
    playerMovement.down = false;
  }
};

setInterval(() => {
  socket.emit('playerMovement', playerMovement);
}, 1000 / 60);

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);