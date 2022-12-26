class Sky {
  constructor(horizon, assets, style = 'level') {
    this.assets = assets
    this.top = assets.decoration.sky.top
    this.middle = assets.decoration.sky.middle
    this.bottom = assets.decoration.sky.bottom
    this.horizon = horizon
    this.style = style
    if (this.style === 'overworld') {
      this.palms = new Group()
      this.clouds = new Group()
      this.initOverworld()
    }
  }

  initOverworld() {
    for (let i = 0; i < 15; i++) {
      const randIndex = randomIntFromInterval(0, this.assets.overworld.palms.images.length - 1)
      const image = this.assets.overworld.palms.images[randIndex]
      const x = randomIntFromInterval(0, SCREEN_WIDTH)
      const y = (this.horizon * TILE_SIZE) + randomIntFromInterval(50, 100)
      const sprite = new Sprite(this.palms)
      const rect = getRect(image, "midbottom", new Vector2D(x, y))
      sprite.image = image
      sprite.rect = rect  
    }

    for (let i = 0; i < 15; i++) {
      const randIndex = randomIntFromInterval(0, this.assets.overworld.clouds.images.length - 1)
      const image = this.assets.overworld.clouds.images[randIndex]
      const x = randomIntFromInterval(0, SCREEN_WIDTH)
      const y = randomIntFromInterval(0, (this.horizon * TILE_SIZE) - 100)
      const sprite = new Sprite(this.clouds)
      const rect = getRect(image, "midbottom", new Vector2D(x, y))
      sprite.image = image
      sprite.rect = rect  
    }
  }

  draw(ctx) {
    for (let row = 0; row < VERTICAL_TILE_NUMBER; row++) {
      if (row < this.horizon) {
        ctx.drawImage(this.top, 0, row * TILE_SIZE, SCREEN_WIDTH, TILE_SIZE)
      } else if (row == this.horizon) {
        ctx.drawImage(this.middle, 0, row * TILE_SIZE, SCREEN_WIDTH, TILE_SIZE)
      } else {
        ctx.drawImage(this.bottom, 0, row * TILE_SIZE, SCREEN_WIDTH, TILE_SIZE)
      }
    }

    if (this.style === 'overworld') {
      this.palms.draw(ctx)
      this.clouds.draw(ctx)
    }
  }
}

class Water {
  constructor(top, levelWidth, assets) {
    this.waterStart = -SCREEN_WIDTH
    this.waterTileWidth = assets[0].width
    this.image = assets[0]
    this.assets = assets
    this.top = top
    this.tileAmount = Math.floor(
      (levelWidth + SCREEN_WIDTH * 2) / this.waterTileWidth
    )
    this.waterSprites = new Group()
    this.init()
  }

  init() {
    for (let i = 0; i < this.tileAmount; i++) {
      const x = i * this.waterTileWidth + this.waterStart
      const y = this.top
      const tile = new Tile(this.image, 0, 0, 0, this.waterTileWidth, y)
      new AnimatedTileSprite(this.waterSprites, tile, x, y, this.assets)
    }
  }

  draw(ctx, shift) {
    this.waterSprites.update(shift)
    this.waterSprites.draw(ctx)
  }
}

class Clouds {
  constructor(horizon, levelWidth, cloudAmount, assets) {
    this.horizon = horizon
    this.levelWidth = levelWidth
    this.cloudAmount = cloudAmount
    this.images = assets
    this.minX = -SCREEN_WIDTH
    this.maxX = levelWidth + SCREEN_WIDTH
    this.minY = 0
    this.maxY = horizon
    this.cloudSprites = new Group()
    this.init()
  }

  init() {
    for (let i = 0; i < this.cloudAmount; i++) {
        const cloud = this.images[randomIntFromInterval(0, this.images.length - 1)]        
        const x = randomIntFromInterval(this.minX, this.maxX)
        const y = randomIntFromInterval(this.minY, this.maxY)
        const tile = new Tile(cloud, 0, 0, 0, cloud.width, cloud.height)
        new StaticTileSprite(this.cloudSprites, tile, x, y)
    }
  }

  draw(ctx, shift) {
    this.cloudSprites.update(shift)
    this.cloudSprites.draw(ctx)
  }
}
