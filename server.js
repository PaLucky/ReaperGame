require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai');
const socket = require('socket.io');
const helmet = require('helmet')
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');
const nocache = require('nocache')

const app = express();

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(nocache())
app.use(helmet.noSniff());
app.use(helmet.xssFilter());
app.use(helmet.hidePoweredBy({ setTo: 'PHP 7.4.3' }));

// Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

app.set('etag', false);

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

// 404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const portNum = process.env.PORT || 3000;

// Set up server and tests
const server = app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});
let io = socket(server);

const gameState = {
  players: {},
  collectibles: {}
}

io.on('connection', (socket) => {
  console.log('A user just connected.');
  socket.on('collision', (c) => {
    gameState.players[socket.id].width = 80;
    gameState.players[socket.id].height = 80;
    gameState.players[socket.id].speed = 10;
    gameState.players[socket.id].score += gameState.collectibles[socket.id].value;
    delete gameState.collectibles[socket.id];
    gameState.collectibles[socket.id] = c;
    setTimeout(() => {
      gameState.players[socket.id].width = 50;
      gameState.players[socket.id].height = 50;
      gameState.players[socket.id].speed = 6;      
    }, 800 );
  });
  socket.on('newPlayer', (p, c) => {
    gameState.players[socket.id] = {
      x: p.x,
      y: p.y,
      width: 50,
      height: 50,
      score: p.score,
      speed: 6,
      id: p.id
    }
    gameState.collectibles[socket.id] = {
      x: 25,
      y: 45,
      value: c.value
    }
    console.log(gameState)
  });
  socket.on('playerMovement', (playerMovement) => {
    const player = gameState.players[socket.id];
    const canvasWidth = 640;
    const canvasHeight = 480;

    if (playerMovement.left && player.x > 0) {
      player.x -= player.speed
    } if (playerMovement.right && player.x < canvasWidth - player.width) {
      player.x += player.speed
    }

    if (playerMovement.up && player.y > 0) {
      player.y -= player.speed
    } if (playerMovement.down && player.y < canvasHeight - player.height) {
      player.y += player.speed
    }
  })



  socket.on('disconnect', () => {
    console.log('A user has disconnected.');
    delete gameState.players[socket.id];
    delete gameState.collectibles[socket.id];
  })
});


setInterval(() => {
  io.sockets.emit('state', gameState);
}, 1000 / 60);





module.exports = app; // For testing
