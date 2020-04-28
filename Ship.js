class Ship {
  constructor(){
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.radius = SHIP_SIZE /2;
    this.inclination = (90 / 180) * Math.PI; //90 degrees to radians
    this.rotation = 0; 

    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
  }

  update(){
    this.inclination += (this.rotation / 180) * Math.PI / FPS;
  }

  render(){
    ctx.strokeStyle = "white";
    ctx.lineWidth = LINE_WIDTH;
    ctx.beginPath();
    //ship nose
    ctx.moveTo(
      this.x + this.radius * Math.cos(this.inclination),
      this.y - this.radius * Math.sin(this.inclination)
    );
    //rear left
    ctx.lineTo(
      this.x - this.radius * (Math.cos(this.inclination) + Math.sin(this.inclination)),
      this.y + this.radius * (Math.sin(this.inclination) - Math.cos(this.inclination))
    );
    //rear center
    ctx.lineTo(
      this.x - this.radius * (2/3) * Math.cos(this.inclination),
      this.y + this.radius * (2/3) * Math.sin(this.inclination)
    );
    //rear right
    ctx.lineTo(
      this.x - this.radius * (Math.cos(this.inclination) - Math.sin(this.inclination)),
      this.y + this.radius * (Math.sin(this.inclination) + Math.cos(this.inclination))
    );
    ctx.closePath();
    ctx.stroke();
  }
}