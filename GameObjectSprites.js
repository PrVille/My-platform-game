//USELESS??

class GameObjectSprite extends Sprite {
  constructor(group, gameObject, dx, dy) {
    super(group)
    this.gameObject = gameObject
    this.dx = dx
    this.dy = dy
    this.image = gameObject.image
    this.rect = getRect(
      this.image,
      "topleft",
      { x: dx, y: dy },
      { width: gameObject.width, height: gameObject.height }
    )
  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      0,
      0,
      this.gameObject.width,
      this.gameObject.height,
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

class StaticGameObjectSprite extends GameObjectSprite {
  constructor(group, gameObject, dx, dy) {
    super(group, gameObject, dx, dy)
  }
}

class Crate extends StaticGameObjectSprite {
  constructor(group, gameObject, dx, dy) {
    super(group, gameObject, dx, dy)
    console.log(gameObject);

    this.offsetY = dy + TILE_SIZE
    this.rect = getRect(
      this.image,
      "bottomleft",
      { x: dx, y: this.offsetY },
      { width: gameObject.width, height: gameObject.height }
    )
  }
}
