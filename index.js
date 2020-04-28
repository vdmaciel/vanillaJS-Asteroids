const FPS = 60; //frames per second
const LINE_WIDTH = 2; //default line width for drawing

const SHIP_SIZE = 30 ; //ship height in pixels

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