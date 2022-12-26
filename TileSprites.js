class TileSprite extends Sprite {
  constructor(group, tile, dx, dy, surf = null) {
    super(group)    
    this.tile = tile
    this.dx = dx
    this.dy = dy
    this.sx = surf ? -TILE_SIZE/2 + surf.width/2 : tile.sx
    this.sy = surf ? -TILE_SIZE/2 + surf.height/2 : tile.sy
    this.width = tile.width
    this.height = tile.height
    this.image = surf ? surf : tile.image
    this.rect = getRect(
      this.image,
      "topleft",
      { x: dx, y: dy },
      { width: this.width, height: this.height }
    )
  }

  draw(ctx) {
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
  }

  update({ shift }) {
    this.rect.x += shift
  }
}

class StaticTileSprite extends TileSprite {
  constructor(group, tile, dx, dy) {
    super(group, tile, dx, dy)
  }
}

//OBJECT
class CrateTile extends StaticTileSprite {
  constructor(group, gameObject, dx, dy) {
    super(group, gameObject, dx, dy)
    this.sx = 0
    this.sy = 0
    this.width = gameObject.width
    this.height = gameObject.height
    this.offsetY = dy + TILE_SIZE
    this.rect = getRect(
      this.image,
      "bottomleft",
      { x: dx, y: this.offsetY },
      { width: this.width, height: this.height }
    )
  }
}

class AnimatedTileSprite extends TileSprite {
  constructor(group, tile, dx, dy, frames) {
    super(group, tile, dx, dy)
    this.frames = frames
    this.frameIndex = 0
    this.image = this.frames[this.frameIndex]
  }

  animate() {
    this.frameIndex += 0.075
    if (this.frameIndex >= this.frames.length) {
      this.frameIndex = 0
    }
    this.image = this.frames[Math.floor(this.frameIndex)]
  }

  update({ shift }) {
    this.animate()
    this.rect.x += shift
    if (this.hitbox) this.hitbox.x += shift
  }
}

class Coin extends AnimatedTileSprite {
  constructor(group, tile, dx, dy, frames, value) {
    super(group, tile, dx, dy, frames)
    this.sx = -this.image.width / 2
    this.sy = -this.image.height / 2
    this.centerX = dx + TILE_SIZE / 2
    this.centerY = dy + TILE_SIZE / 2
    this.rect = getRect(
      this.image,
      "center",
      { x: this.centerX, y: this.centerY },
      { width: tile.width, height: tile.height }
    )
    this.hitbox = this.rect.inflate(-30, -30)
    this.value = value
  }
}

//OBJECT
class Palm extends AnimatedTileSprite {
  constructor(group, gameObject, dx, dy, frames) {
    super(group, gameObject, dx, dy, frames)
    this.sx = 0
    this.sy = 0
    this.width = gameObject.width
    this.height = gameObject.height
    this.offsetY = dy + TILE_SIZE
    this.rect = getRect(
      this.image,
      "bottomleft",
      { x: dx, y: this.offsetY },
      { width: this.width, height: this.height }
    )
  }
}
