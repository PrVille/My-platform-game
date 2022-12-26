class Game {
  constructor(width, height, assets, layers, tiles, gameObjects, levels) {
    this.canvas = document.getElementById("canvas")
    this.ctx = this.canvas.getContext("2d")
    this.canvasWidth = this.canvas.width = width
    this.canvasHeight = this.canvas.height = height
    this.layers = layers
    this.assets = assets
    this.tiles = tiles
    this.gameObjects = gameObjects
    this.levels = levels
    this.clock = new Clock()
    this.frame = 0

    //game consts
    this.maxLevel = 0
    this.maxHealth = 100
    this.currentHealth = 100
    this.coins = 0

    //audio
    this.levelMusic = new Audio('./audio/level_music.wav')
    this.levelMusic.volume = 0.01
    this.levelMusic.loop = true
    this.overworldMusic = new Audio('./audio/overworld_music.wav')
    this.overworldMusic.volume = 0.01
    this.overworldMusic.loop = true

    //overworld connection
    this.overworld = new Overworld(
      0,
      this.maxLevel,
      this.ctx,
      this.createLevel.bind(this),
      this.assets
    )
    this.status = "overworld"

    //level init
    this.level

    //UI
    this.ui = new UI(this.ctx, this.assets)

    
  }

  createLevel(currentLevel) {
    this.level = new Level(
      this.ctx,
      this.canvasWidth,
      this.canvasHeight,
      this.layers,
      this.assets,
      this.tiles,
      this.gameObjects,
      currentLevel,
      this.createOverworld.bind(this),
      this.levels,
      this.updateCoins.bind(this),
      this.updateHealth.bind(this)
    )
    this.status = "level"
    this.overworldMusic.pause()
    this.levelMusic.currentTime = 0
    this.levelMusic.play()
  }

  createOverworld(currentLevel, newMaxLevel) {
    if (newMaxLevel > this.maxLevel) {
      this.maxLevel = newMaxLevel
    }
    this.overworld = new Overworld(
      currentLevel,
      this.maxLevel,
      this.ctx,
      this.createLevel.bind(this),
      this.assets
    )
    this.status = "overworld"
    this.levelMusic.pause()
    this.overworldMusic.currentTime = 0
    this.overworldMusic.play()
  }

  updateCoins(amount) {
    this.coins += amount
  }

  updateHealth(amount) {
    this.currentHealth += amount
  }

  checkGameOver() {
    if (this.currentHealth <= 0) {
      this.currentHealth = 100
      this.coins = 0
      this.maxLevel = 0
      this.overworld = new Overworld(
        0,
        this.maxLevel,
        this.ctx,
        this.createLevel.bind(this),
        this.assets
      )
      this.status = "overworld"
      this.levelMusic.pause()
      this.overworldMusic.currentTime = 0
      this.overworldMusic.play()
    }
  }

  run() {
    const animate = () => {
      this.frame = requestAnimationFrame(animate)
      const dt = this.clock.tick() / 1000
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
      if (this.status === "overworld") {
        this.overworld.run()
      } else {
        this.level.run()
        this.ui.showHealth(this.currentHealth, this.maxHealth)
        this.ui.showCoins(this.coins)
        this.checkGameOver()
      }
    }
    animate()
  }

  stop(duration) {
    if (duration) {
      setTimeout(
        function () {
          cancelAnimationFrame(this.frame)
          console.log(`Exited after ${duration} seconds`)
          console.log("actual time", Date.now() - time, "ms")
        }.bind(this),
        duration * 1000
      ) //stop game after x seconds
    } else {
      cancelAnimationFrame(this.frame)
    }
  }
}
