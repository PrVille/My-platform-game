class Enemy extends AnimatedTileSprite {
  constructor(group, tile, dx, dy, frames) {
    super(group, tile, dx, dy, frames)    
    this.sx = -(TILE_SIZE - this.image.width) / 2    
    this.sy = -(TILE_SIZE - this.image.height) 
    this.centerX = dx + TILE_SIZE / 2
    this.centerY = dy + TILE_SIZE / 2
    this.rect = getRect(
      this.image,
      "center",
      { x: this.centerX, y: this.centerY },
      { width: tile.width, height: tile.height }
    )
    this.speed = randomIntFromInterval(1, 2)
    this.hitboxOffset = new Vector2D(10, 20)
    this.hitbox = new Rect(this.rect.x + this.hitboxOffset.x / 2, this.rect.y + this.hitboxOffset.y , this.rect.w - this.hitboxOffset.x, this.rect.h - this.hitboxOffset.y)    
  }

  move() {
    this.rect.x += this.speed    
    this.hitbox.midbottom = this.rect.midbottom
  }

  mirror(ctx, image, x = 0, y = 0, width, height,horizontal = false, vertical = false) {
    ctx.save();  // save the current canvas state
    ctx.setTransform(
        horizontal ? -1 : 1, 0, // set the direction of x axis
        0, vertical ? -1 : 1,   // set the direction of y axis
        x + (horizontal ? image.width : 0), // set the x origin
        y + (vertical ? image.height : 0)   // set the y origin
    );
    ctx.drawImage(image,this.rect.x, 0, this.width, this.height, 0,0,this.rect.width, this.rect.height);
    ctx.restore(); // restore the state as it was when this function was called
  }

  draw(ctx) {
    
    ctx.save()
    //flip image
    if (this.speed > 0) {
      ctx.translate(this.rect.x + this.width/2, this.rect.y + this.width/2);
      ctx.scale(-1, 1);
      ctx.translate(-(this.rect.x + this.width/2), -(this.rect.y + this.width/2));
    }

    ctx.drawImage(
      this.image,
      this.sx,
      this.sy,
      this.width,
      this.height,
      this.rect.x,
      this.rect.y,
      this.rect.width,
      this.rect.height
    )
    ctx.restore()
  }

  reverse() {
    this.speed *= -1
  }

  update({ shift }) {
    this.rect.x += shift
    this.hitbox.x += shift
    this.animate()
    this.move()
  }
}
