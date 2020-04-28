class Particle {
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.distance = 0;
    this.dx = (Math.random() * PARTICLE_SPEED * (Math.random() < 0.5 ? 1 : -1)) / FPS;
    this.dy = (Math.random() * PARTICLE_SPEED * (Math.random() < 0.5 ? 1 : -1)) / FPS;
  
    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
  }

  update(){
    this.distance += Math.sqrt(
      Math.pow(this.dx, 2) + Math.pow(this.dy, 2)
    );
    this.x += this.dx;
    this.y += this.dy;
  }

  render(){
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
    ctx.fill();
  }
}