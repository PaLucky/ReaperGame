import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

//const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

var image = new MarvinImage();
var avatar = '/public/img/grim-reaper.png'

image.load( avatar , function(){
   Marvin.scale(image.clone(), image, 50, 50);
   image.setColorToAlpha(0, 0);
   image.draw(canvas);
});



/*
make_base();

function make_base()
{
  var base_image = new Image();
  base_image.src = '/public/img/grim-reaper.png';
  base_image.onload = function(){
    //base_image.setColorToAlpha(0, 0);
    context.drawImage(base_image, 0, 0, 30,30);
  }
}
*/