class Group {
  constructor() {
    this.sprites = []
  }

  addSprite(sprite) {
    this.sprites.push(sprite)
  }

  removeSprite(sprite) {
    const index = this.sprites.indexOf(sprite);
    if (index > -1) { // only splice array when item is found
      this.sprites.splice(index, 1); // 2nd parameter means remove one item only
    }    
  }

  draw(ctx) {
    this.sprites.forEach((sprite) => {
      sprite.draw(ctx)
    })
  }

  drawRect(ctx, color) {
    this.sprites.forEach((sprite) => {
      sprite.drawRect(ctx, color)
    })
  }

  update(props) {
    this.sprites.forEach((sprite) => {
      sprite.update(props)
    })
  }
}
