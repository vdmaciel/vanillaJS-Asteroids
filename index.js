const FPS = 60; //frames per second


/**@type {HTMLCanvasElement} */
const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");

//set up the game loop
setInterval(() => {
  update();
  render();
}, 1000 / FPS);

function update(){

}

function render(){
  //draw background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
}