const FPS = 60; //frames per second
const LINE_WIDTH = 2; //default line width for drawing

const SHIP_SIZE = 30; //ship height in pixels
const SHIP_TURN_SPEED = 250; //ship turn speed in degrees
const SHIP_THRUST_POWER = 5;
const SPACE_FRICTION = 0.7;

/**@type {HTMLCanvasElement} */
const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");

let ship = new Ship();

//set up the game loop
setInterval(() => {
  update();
  render();
}, 1000 / FPS);

function update(){

  ship.update();
}

function render(){
  //draw background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ship.render();
}


/**************************
 * handle events
 *************************/

window.addEventListener("keydown", event => {
  switch(event.key){
    case "ArrowLeft":
      ship.rotation = SHIP_TURN_SPEED;
      break;
    case "ArrowRight":
      ship.rotation = -SHIP_TURN_SPEED;
      break;
    case "ArrowUp":
      ship.thrusting = true;
      break;
  }
})

window.addEventListener("keyup", event => {
  switch(event.key){
    case "ArrowLeft":
      ship.rotation = 0;
      break;
    case "ArrowRight":
      ship.rotation = 0;
      break;
    case "ArrowUp":
      ship.thrusting = false;
      break;
  }
})