class UI {
  constructor(ctx, assets) {
    this.ctx = ctx
    //health
    this.healthBar = assets.ui.healthBar
    this.healthBarTopLeft = new Vector2D(54, 39)
    this.barMaxWidth = 152 //pixels
    this.barHeight = 4 //pixels

    //coins
    this.coin = assets.ui.coin
    this.coinRect = getRect(this.coin, "topleft", new Vector2D(50, 61))
  }

  showHealth(currentHealth, maxHealth) {
    this.ctx.drawImage(this.healthBar, 20, 10)
    const currentHealthRatio = currentHealth / maxHealth
    const currentBarWidth = this.barMaxWidth * currentHealthRatio
    this.ctx.fillStyle = '#dc4949'
    this.ctx.fillRect(this.healthBarTopLeft.x, this.healthBarTopLeft.y, currentBarWidth, this.barHeight)
  }

  showCoins(amount) {
    this.ctx.drawImage(this.coin, this.coinRect.x, this.coinRect.y)
    this.ctx.fillStyle = "#33323d"
    this.ctx.font = "30px serif"
    this.ctx.fillText(amount, this.coinRect.centerx + 20, this.coinRect.y + 26)
  }

}
