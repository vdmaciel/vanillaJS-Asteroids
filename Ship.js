class Ship {
  constructor(){
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.radius = SHIP_SIZE /2;
    this.inclination = (90 / 180) * Math.PI; //90 degrees to radians
    this.rotation = 0; 
    this.thrust = { x: 0, y: 0 }
    this.thrusting = false;
    this.canShoot = true;
    this.lasers = [];

    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
    this.shoot = this.shoot.bind(this);
  }

  shoot(){
    if(this.canShoot && this.lasers.length < MAX_LASER_NUM){
      this.lasers.push({
        x: this.x + this.radius * Math.cos(this.inclination),
        y: this.y - this.radius * Math.sin(this.inclination),
        inclination: this.inclination,
        dx: LASER_SPEED * Math.cos(this.inclination),
        dy: LASER_SPEED * Math.sin(this.inclination),
        distance: 0,
      });

      this.canShoot = false;
    }
  }

  update(){
    //rotation movement
    this.inclination += (this.rotation / 180) * Math.PI / FPS;

    //thrusting
    if(this.thrusting){
      this.thrust.x += (SHIP_THRUST_POWER * Math.cos(this.inclination)) / FPS;
      this.thrust.y -= (SHIP_THRUST_POWER * Math.sin(this.inclination)) / FPS;
    } else {
      this.thrust.x -= (SPACE_FRICTION * this.thrust.x) / FPS;
      this.thrust.y -= (SPACE_FRICTION * this.thrust.y) / FPS;
    }

    //ship movement
    this.x += this.thrust.x;
    this.y += this.thrust.y;

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

    //lasers movement
    for(let i = this.lasers.length - 1; i >= 0; i--){
      this.lasers[i].x += this.lasers[i].dx / FPS;
      this.lasers[i].y -= this.lasers[i].dy / FPS;

      if(this.lasers[i].x < 0 || this.lasers[i].x > canvas.width || this.lasers[i].y < 0 || this.lasers[i].y > canvas.height){
        this.lasers.splice(i, 1);
      }
    }
  }

  render(){

    //draw ship
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

    //draw lasers
    this.lasers.forEach(laser => {
      ctx.strokeStyle = "white";
      ctx.beginPath();
      ctx.moveTo(laser.x, laser.y);
      ctx.lineTo(
        laser.x + 10 * Math.cos(laser.inclination),
        laser.y - 10 * Math.sin(laser.inclination)
      );
      ctx.stroke();
    })
  }
}