class Sprite {
  constructor(group = null) {
    if (Array.isArray(group)) {
      group.forEach((g) => {
        g.addSprite(this)
      })
    } else group.addSprite(this)
    this.groups = group
    this.image
    this.rect
  }

  kill() {
    if (Array.isArray(this.groups)) {
      this.groups.forEach((g) => {
        g.removeSprite(this)
      })
    } else {
      this.groups.removeSprite(this)
    }
  }

  draw(ctx) {
    if (this.image.constructor.name === "Surface") {
      ctx.fillStyle = this.image.color
      ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height)
    } else ctx.drawImage(this.image, this.rect.x, this.rect.y)

    //ctx.fillStyle = "white"
    //if (rect.width < 1000) ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
    //ctx.fillStyle = "red"
    //ctx.fillRect(640, 320, this.rect.width, this.rect.height)
  }

  drawRect(ctx, color) {
    ctx.save()
    ctx.globalAlpha = 0.1 //opacity
    ctx.fillStyle = color || "red"
    ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height)
    ctx.restore()
  }

  update(dt) {}
}
