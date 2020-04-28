class Ship {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.radius = SHIP_SIZE / 2;
    this.inclination = (90 / 180) * Math.PI; //90 degrees to radians
    this.rotation = 0;
    this.thrust = { x: 0, y: 0 };
    this.thrusting = false;
    this.canShoot = true;
    this.lasers = [];
    this.show = true;
    this.exploding = false;
    this.invencible = false;
    this.lives = GAME_LIVES;
    this.alive = true;

    this.blinkTimeout;
    this.blinkInterval;
    this.explodeTimeout;

    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
    this.shoot = this.shoot.bind(this);
    this.reset = this.reset.bind(this);
    this.explode = this.explode.bind(this);
    this.blink = this.blink.bind(this);

    this.blink();
  }

  explode() {
    if(!this.exploding) this.lives--;
    generateParticles(this.x, this.y, 50);
    clearTimeout(this.explodeTimeout);
    this.exploding = true;
    this.invencible = true;
    this.explodeTimeout = setTimeout(() => this.reset(), 1500);
  }

  blink() {
    clearTimeout(this.blinkTimeout);
    clearInterval(this.blinkInterval);
    this.blinkInterval = setInterval(() => (this.show = !this.show), 100);
    this.blinkTimeout = setTimeout(() => {
      clearInterval(this.blinkInterval);
      this.invencible = false;
      this.show = true;
    }, 5000);
  }

  reset() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.inclination = (90 / 180) * Math.PI;
    this.thrusting = false;
    this.thrust = { x: 0, y: 0 };
    this.exploding = false;
    this.alive = true;
    this.blink();
  }

  shoot() {
    if (this.canShoot && this.lasers.length < MAX_LASER_NUM) {
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

  update() {
    //rotation movement
    this.inclination += ((this.rotation / 180) * Math.PI) / FPS;

    //thrusting
    if (this.thrusting) {
      this.thrust.x += (SHIP_THRUST_POWER * Math.cos(this.inclination)) / FPS;
      this.thrust.y -= (SHIP_THRUST_POWER * Math.sin(this.inclination)) / FPS;
    } else {
      this.thrust.x -= (SPACE_FRICTION * this.thrust.x) / FPS;
      this.thrust.y -= (SPACE_FRICTION * this.thrust.y) / FPS;
    }

    if (!this.exploding) {
      //ship movement
      this.x += this.thrust.x;
      this.y += this.thrust.y;

      //handle edge of screen
      if (this.x < 0 - this.radius) {
        this.x = canvas.width + this.radius;
      } else if (this.x > canvas.width + this.radius) {
        this.x = 0 - this.radius;
      }

      if (this.y < 0 - this.radius) {
        this.y = canvas.height + this.radius;
      } else if (this.y > canvas.height + this.radius) {
        this.y = 0 - this.radius;
      }
    }

    //lasers movement
    for (let i = this.lasers.length - 1; i >= 0; i--) {
      this.lasers[i].x += this.lasers[i].dx / FPS;
      this.lasers[i].y -= this.lasers[i].dy / FPS;

      if (
        this.lasers[i].x < 0 ||
        this.lasers[i].x > canvas.width ||
        this.lasers[i].y < 0 ||
        this.lasers[i].y > canvas.height
      ) {
        this.lasers.splice(i, 1);
      }
    }

    //detect laser collision with asteroids
    for (let i = asteroids.length - 1; i >= 0; i--) {
      let ax = asteroids[i].x;
      let ay = asteroids[i].y;
      let ar = asteroids[i].radius;

      //loop over the lasers
      for (let j = this.lasers.length - 1; j >= 0; j--) {
        let lx = this.lasers[j].x;
        let ly = this.lasers[j].y;

        if (distanceBetweenPoints(ax, ay, lx, ly) < ar) {
          //destroy laser
          this.lasers.splice(j, 1);
          //remove asteroid
          destroyAsteroid(i);

          break;
        }
      }
    }

    //detect collisions with asteroids
    if (!this.exploding && !this.invencible && ship.alive) {
      for (let i = 0; i < asteroids.length; i++) {
        if (
          distanceBetweenPoints(
            this.x,
            this.y,
            asteroids[i].x,
            asteroids[i].y
          ) <
          this.radius + asteroids[i].radius
        ) {
          this.explode();
          destroyAsteroid(i);
        }
      }
    }
  }

  render() {
    if (this.show && !this.exploding && this.alive) {
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
        this.x -
          this.radius *
            (Math.cos(this.inclination) + Math.sin(this.inclination)),
        this.y +
          this.radius *
            (Math.sin(this.inclination) - Math.cos(this.inclination))
      );
      //rear center
      ctx.lineTo(
        this.x - this.radius * (2 / 3) * Math.cos(this.inclination),
        this.y + this.radius * (2 / 3) * Math.sin(this.inclination)
      );
      //rear right
      ctx.lineTo(
        this.x -
          this.radius *
            (Math.cos(this.inclination) - Math.sin(this.inclination)),
        this.y +
          this.radius *
            (Math.sin(this.inclination) + Math.cos(this.inclination))
      );
      ctx.closePath();
      ctx.stroke();
    }

    //draw lasers
    this.lasers.forEach((laser) => {
      ctx.strokeStyle = "white";
      ctx.beginPath();
      ctx.moveTo(laser.x, laser.y);
      ctx.lineTo(
        laser.x + 10 * Math.cos(laser.inclination),
        laser.y - 10 * Math.sin(laser.inclination)
      );
      ctx.stroke();
    });
  }
}
