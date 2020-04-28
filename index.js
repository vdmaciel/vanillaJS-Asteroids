const FPS = 60; //frames per second
const LINE_WIDTH = 2; //default line width for drawing

const SHIP_SIZE = 30; //ship height in pixels
const SHIP_TURN_SPEED = 250; //ship turn speed in degrees
const SHIP_THRUST_POWER = 5; //ship acceleration in pixels
const SPACE_FRICTION = 0.7; //friction coefficient of space (0: no friction 1: no movement);

const ASTEROID_SPEED = 50; //initial asteroid speed in pixels
const MAX_ASTEROID_VERTICES = 10; //max number of vertices in each asteroid
const ASTEROID_SIZE = 100; //initial asteroid size
const ASTEROID_NUM = 9; //initial number of asteroids
const ASTEROID_JAGGEDNESS = 0.5;
const SMALL_POINT = 60;
const MEDIUM_POINT = 30;
const LARGE_POINT = 20;

const MAX_LASER_NUM = 20;
const LASER_SPEED = 500;
const LASER_MAX_DISTANCE = 70;

const TEXT_LARGE = 40;
const TEXT_SMALL = 20;

const PARTICLE_SPEED = 80;
const GAME_LIVES = 3;

/**@type {HTMLCanvasElement} */
const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");

let asteroids;
let particles;
let lives;
let score;
let ship;

//initialize game entities
newGame();

//set up the game loop
setInterval(() => {
  update();
  render();
}, 1000 / FPS);

function update(){

  if(ship.lives <= 0) gameOver();

  ship.update();

  asteroids.forEach(asteroid => asteroid.update());

  //update particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    //check distance travelled by each particle
    if (particles[i].distance > 50) {
      particles.splice(i, 1);
    }
  }
}

function render(){
  //draw background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ship.render();

  asteroids.forEach(asteroid => asteroid.render());

  particles.forEach(particle => particle.render());

  displayLives();
  displayScore();

  if(ship.alive){
    ship.render();
  } else {
    displayGameOverScreen();
  }
}


/**************************
 * handle events
 *************************/

window.addEventListener("keydown", event => {
  switch(event.keyCode){
    case 37:
      ship.rotation = SHIP_TURN_SPEED;
      break;
    case 39:
      ship.rotation = -SHIP_TURN_SPEED;
      break;
    case 38:
      ship.thrusting = true;
      break;
    case 32:
      ship.shoot();
      break;
    case 13:
      if(!ship.alive) newGame();
      break;
  }
})

window.addEventListener("keyup", event => {
  switch(event.keyCode){
    case 37:
      ship.rotation = 0;
      break;
    case 39:
      ship.rotation = 0;
      break;
    case 38:
      ship.thrusting = false;
      break;
    case 32:
      ship.canShoot = true;
      break;
  }
})

/****************************************
 * Utilities
 ***************************************/

function newGame(){
  asteroids = [];
  particles = [];
  lives = GAME_LIVES;
  score = 0;
  ship = new Ship();
  generateAsteroids();
}

function generateAsteroids(){
  asteroids = [];
  for(let i = 0; i < ASTEROID_NUM; i++){
    do {
      x = Math.floor(Math.random() * canvas.width);
      y = Math.floor(Math.random() * canvas.height);
    } while (
      distanceBetweenPoints(ship.x, ship.y, x, y) < ASTEROID_SIZE * 2 + ship.radius
    )
    asteroids.push(new Asteroid(x, y, Math.ceil(ASTEROID_SIZE / 2)));
  }
}

function distanceBetweenPoints(x1, y1, x2, y2){
  return Math.sqrt(Math.pow(x1 -x2, 2) + Math.pow(y1 - y2, 2));
}

function destroyAsteroid(index){
  let x = asteroids[index].x;
  let y = asteroids[index].y;
  let radius = asteroids[index].radius;

  //split asteroid
  if(
    radius === Math.ceil(ASTEROID_SIZE / 2) ||
    radius === Math.ceil(ASTEROID_SIZE / 4)
  ) {
    asteroids.push(new Asteroid(x, y, radius / 2));
    asteroids.push(new Asteroid(x, y, radius / 2));
  }

  //incrase score
  if(radius === Math.ceil(ASTEROID_SIZE / 2)) score += LARGE_POINT;
  else if(radius === Math.ceil(ASTEROID_SIZE / 4)) score += MEDIUM_POINT;
  else score += SMALL_POINT;

  generateParticles(asteroids[index].x, asteroids[index].y, 10);

  asteroids.splice(index, 1);
}

function generateParticles(x, y, num){
  for(let i = 0; i < num; i++) particles.push(new Particle(x, y));
}

function gameOver(){
  ship.alive = false;
}

function displayGameOverScreen(){
  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  ctx.font = "small-caps " + TEXT_LARGE + "px dejavu sans mono";
  ctx.fillText(`Game Over`, canvas.width / 2, canvas.height * 0.75);

  ctx.font = ctx.font = "small-caps " + TEXT_SMALL + "px dejavu sans mono";
  ctx.fillText("Press enter to restart", canvas.width / 2, canvas.height * 0.5);
}

function displayLives(){
  //draw the lives
  ctx.textAlign = "left";
  ctx.fillStyle = "white";
  ctx.font = "small-caps " + TEXT_SMALL + "px dejavu sans mono";
  ctx.fillText(`Lives: ${ship.lives}`, 10, 25);
}

function displayScore(){
  //draw the lives
  ctx.textAlign = "left";
  ctx.fillStyle = "white";
  ctx.font = "small-caps " + TEXT_SMALL + "px dejavu sans mono";
  ctx.fillText(`Score: ${score}`, 120, 25);
}