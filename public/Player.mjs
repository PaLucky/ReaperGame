class Player {
  constructor({x, y, score, id}) {
    this.x = x;
    this.y= y;
    this.score= score;
    this.id=id;
  }

  movePlayer(dir, speed) {
    const canvasWidth = 640;
    const canvasHeight = 480;
        if (dir=='left' && this.x > 0) {
      this.x -= speed
    } if (dir=='right' && this.x < canvasWidth - 50) {
      this.x += speed
    }

    if (dir=='up' && this.y > 0) {
      this.y -= speed
    } if (dir=='down' && this.y < canvasHeight - 50) {
      this.y += speed
    }

  }

  collision(item) {
      var myleft = this.x;
      var myright = this.x + 50;
      var mytop = this.y;
      var mybottom = this.y + 50;
      var itemleft = item.x;
      var itemright = item.x + 30;
      var itemtop = item.y;
      var itembottom = item.y + 30;
      var crash = true;
      if ((mybottom < itemtop) || (mytop > itembottom) ||
           (myright < itemleft) ||  (myleft > itemright)) {
      crash = false;
    }
    return crash;
  }


  calculateRank(arr) {

    let sorted=arr.sort(function(a, b){return b.score - a.score});
    let rank;
    sorted.forEach((player, idx) => {
      if(this.id == player.id) rank = idx+1;
    });

    return `Rank: ${rank} / ${arr.length}`;
    /*if(arr[0].score > arr[1].score){
      if (arr[0].id == this.id) return "Rank: 1/2";
      else return "Rank: 2/2";
    }
    else {
      if (arr[0].id == this.id) return "Rank: 2/2";
      else return "Rank: 1/2";
    }*/

  }
}

export default Player;
