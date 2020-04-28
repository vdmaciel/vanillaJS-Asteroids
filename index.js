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

const MAX_LASER_NUM = 20;
const LASER_SPEED = 500;
const LASER_MAX_DISTANCE = 70;

/**@type {HTMLCanvasElement} */
const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");

let asteroids = [];
let ship = new Ship();

generateAsteroids();

//set up the game loop
setInterval(() => {
  update();
  render();
}, 1000 / FPS);

function update(){

  ship.update();

  asteroids.forEach(asteroid => asteroid.update());
}

function render(){
  //draw background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ship.render();

  asteroids.forEach(asteroid => {
    asteroid.render()
  });
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