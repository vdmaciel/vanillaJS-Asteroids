class Asteroid {
  constructor(x, y, radius){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = Math.random() * ASTEROID_SPEED * (Math.random() > 0.5 ? -1 : 1);
    this.dy = Math.random() * ASTEROID_SPEED * (Math.random() > 0.5 ? -1 : 1);
    this.inclination = Math.random() * Math.PI * 2;
    this.vertices = Math.floor(Math.random() * MAX_ASTEROID_VERTICES + (MAX_ASTEROID_VERTICES / 2));
    this.vertexOffsets = [];

    this.generateVertexOffsets();

    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
  }

  generateVertexOffsets(){
    for(let i = 0; i < this.vertices; i++){
      this.vertexOffsets.push(Math.random() * ASTEROID_JAGGEDNESS * 2 + 1 - ASTEROID_JAGGEDNESS)
    }
  }

  update(){
    //move asteroid
    this.x += this.dx / FPS;
    this.y += this.dy / FPS;

    //handle edge of screen
    if(this.x < 0 - this.radius){
      this.x = canvas.width + this.radius;
    } else if(this.x > canvas.width + this.radius){
      this.x = 0 - this.radius;
    }

    if(this.y < 0 - this.radius){
      this.y = canvas.height + this.radius;
    } else if(this.y > canvas.height + this.radius){
      this.y = 0 - this.radius;
    }
  }

  render(){
    ctx.strokeStyle = "grey";
    ctx.beginPath();
    //starting point
    ctx.moveTo(
      this.x + this.radius * this.vertexOffsets[0] * Math.cos(this.inclination),
      this.y + this.radius * this.vertexOffsets[0] * Math.sin(this.inclination)
    );

    //draw polygon
    for(let i = 1; i < this.vertices; i++){
      ctx.lineTo(
        this.x + this.radius * this.vertexOffsets[i] * Math.cos(this.inclination + (i * Math.PI * 2) / this.vertices),
        this.y + this.radius * this.vertexOffsets[i] * Math.sin(this.inclination + (i * Math.PI * 2) / this.vertices)
      );
    }
    ctx.closePath();
    ctx.stroke();
  }
}