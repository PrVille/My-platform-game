class Level {
  constructor(
    ctx,
    canvasWidth,
    canvasHeight,
    layers,
    assets,
    tiles,
    gameObjects,
    currentLevel,
    createOverworld,
    levels,
    updateCoins,
    updateHealth
  ) {
    //level setup
    this.ctx = ctx
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.worldShift = 0
    this.speed = 4
    this.currentX = 0
    this.playerOnGround = false
    this.assets = assets
    this.allowMovement = false
    this.movementTimer = new Timer(300, () => this.allowMovement = true)
    this.movementTimer.activate()

    //audio
    this.coinSound = new Audio("./audio/effects/coin.wav")
    this.coinSound.volume = 0.01
    this.stompSound = new Audio("./audio/effects/stomp.wav")
    this.stompSound.volume = 0.05

    //overworld connection
    this.currentLevel = currentLevel
    this.levelData = levels[this.currentLevel]
    this.layers = layers[this.currentLevel]
    this.newMaxLevel = this.levelData["unlock"]
    this.createOverworld = createOverworld

    //player setup
    this.playerLayout = this.layers.player.getTiles(tiles)
    this.playerSprite = this.playerSetup(this.playerLayout, updateHealth) //single
    this.player //created in createtilegroup
    this.goalSprite = this.createTileGroup(this.playerLayout, "goal") //single

    //UI
    this.updateCoins = updateCoins
    this.updateHealth = updateHealth

    //dust
    this.dust = new Group() // single

    //explosion
    this.explosion = new Group() //single

    //terrain setup
    this.terrainLayout = this.layers.terrain.getTiles(tiles)
    this.terrainSprites = this.createTileGroup(this.terrainLayout, "terrain")
    //grass setup
    this.grassLayout = this.layers.grass.getTiles(tiles)
    this.grassSprites = this.createTileGroup(this.grassLayout, "grass")
    //crates setup
    this.crateLayout = this.layers.crates.getObjects(gameObjects)
    this.crateSprites = this.createTileGroup(this.crateLayout, "crates")
    //coins setup
    this.coinLayout = this.layers.coins.getTiles(tiles)
    this.coinSprites = this.createTileGroup(this.coinLayout, "coins")
    //fg_palms setup
    this.fgPalmLayout = this.layers.fg_palms.getObjects(gameObjects)
    this.fgPalmSprites = this.createTileGroup(this.fgPalmLayout, "fgPalms")
    //bg_palms setup
    this.bgPalmLayout = this.layers.bg_palms.getObjects(gameObjects)
    this.bgPalmSprites = this.createTileGroup(this.bgPalmLayout, "bgPalms")
    //enemy setup
    this.enemyLayout = this.layers.enemies.getTiles(tiles)
    this.enemySprites = this.createTileGroup(this.enemyLayout, "enemies")
    //constraints setup
    this.constraintsLayout = this.layers.constraints.getTiles(tiles)
    this.constraintSprites = this.createTileGroup(
      this.constraintsLayout,
      "constraints"
    )

    //decoration
    this.sky = new Sky(8, this.assets)
    this.levelWidth =
      (this.layers.terrain.data.length / VERTICAL_TILE_NUMBER) * TILE_SIZE
    this.water = new Water(
      SCREEN_HEIGHT - 20,
      this.levelWidth,
      assets.decoration.water.images
    )
    this.clouds = new Clouds(
      400,
      this.levelWidth,
      20,
      this.assets.decoration.clouds.images
    )
    //collision group
    this.collisionSprites = [
      ...this.terrainSprites.sprites,
      ...this.crateSprites.sprites,
      ...this.fgPalmSprites.sprites,
    ]
  }

  createTileGroup(layout, type) {
    const spriteGroup = new Group()
    switch (type) {
      //tiles
      case "player": {
        const spawnOffset = -10
        layout.forEach((element) => {
          if (element.tile.gid === 28) {
            this.player = new Player(
              spriteGroup,
              new Vector2D(element.dx + spawnOffset, element.dy),
              this.assets,
              this.ctx,
              this.createJumpParticles.bind(this)
            )
          }
        })
        break
      }
      case "goal": {
        layout.forEach((element) => {
          if (element.tile.gid === 29) {
            new TileSprite(
              spriteGroup,
              element.tile,
              element.dx,
              element.dy,
              this.assets.hat
            )
          }
        })
        break
      }
      case "terrain": {
        layout.forEach((element) => {
          new StaticTileSprite(
            spriteGroup,
            element.tile,
            element.dx,
            element.dy
          )
        })
        break
      }
      case "grass": {
        //console.log(this.assets.hat);

        layout.forEach((element) => {
          new StaticTileSprite(
            spriteGroup,
            element.tile,
            element.dx,
            element.dy
          )
        })
        break
      }
      case "coins": {
        layout.forEach((element) => {
          const val = element.tile.gid === 17 ? "gold" : "silver"
          new Coin(
            spriteGroup,
            element.tile,
            element.dx,
            element.dy,
            this.assets.coins[val].images,
            element.tile.gid === 17 ? 5 : 1
          )
        })
        break
      }
      case "enemies": {
        layout.forEach((element) => {
          new Enemy(
            spriteGroup,
            element.tile,
            element.dx,
            element.dy,
            this.assets.enemy.run.images
          )
        })
        break
      }
      case "constraints": {
        layout.forEach((element) => {
          new StaticTileSprite(
            spriteGroup,
            element.tile,
            element.dx,
            element.dy
          )
        })
        break
      }
      //objects
      case "crates": {
        layout.forEach((element) => {
          new CrateTile(spriteGroup, element.gameObject, element.dx, element.dy)
        })
        break
      }
      case "fgPalms": {
        layout.forEach((element) => {
          const val =
            element.gameObject.gid === 24 ? "palm_small" : "palm_large"
          new Palm(
            spriteGroup,
            element.gameObject,
            element.dx,
            element.dy,
            this.assets.palms[val].images
          )
        })
        break
      }
      case "bgPalms": {
        layout.forEach((element) => {
          new Palm(
            spriteGroup,
            element.gameObject,
            element.dx,
            element.dy,
            this.assets.palms.palm_bg.images
          )
        })
        break
      }
      default: {
        console.log("type not found")
        break
      }
    }

    return spriteGroup
  }

  playerSetup(layout, updateHealth) {
    const spriteGroup = new Group()
    const spawnOffset = -10
    layout.forEach((element) => {
      if (element.tile.gid === 28) {
        this.player = new Player(
          spriteGroup,
          new Vector2D(element.dx + spawnOffset, element.dy),
          this.assets,
          this.ctx,
          this.createJumpParticles.bind(this),
          updateHealth
        )
      }
    })

    return spriteGroup
  }

  createJumpParticles(pos) {
    if (this.player.facingRight) {
      pos.x -= 10
      pos.y -= 5
    } else {
      pos.x += 10
      pos.y += -5
    }

    const jumpParticleSprite = new ParticleEffect(
      this.dust,
      pos,
      "jump",
      this.assets
    )
  }

  horizontalMovementCollision() {
    const player = this.player
    player.hitbox.x += player.direction.x * player.speed

    for (let i = 0; i < this.collisionSprites.length; i++) {
      const sprite = this.collisionSprites[i]

      if (sprite.rect.colliderect(player.hitbox)) {
        if (player.direction.x > 0) {
          //moving right
          player.hitbox.right = sprite.rect.left
          player.onRight = true
          this.currentX = player.rect.right
        }

        if (player.direction.x < 0) {
          //moving left
          player.hitbox.left = sprite.rect.right
          player.onLeft = true
          this.currentX = player.rect.left
        }
        break
      }
    }
  }

  verticalMovementCollision() {
    const player = this.player
    player.applyGravity()

    for (let i = 0; i < this.collisionSprites.length; i++) {
      const sprite = this.collisionSprites[i]

      if (sprite.rect.colliderect(player.hitbox)) {
        if (player.direction.y > 0) {
          //moving down
          player.hitbox.bottom = sprite.rect.top
          player.direction.y = 0
          player.onGround = true
        }
        if (player.direction.y < 0) {
          //moving up
          player.hitbox.top = sprite.rect.bottom
          player.direction.y = 0
          player.onCeiling = true
        }
        break
      }
    }

    if (
      player.onGround &&
      (player.direction.y < 0 || player.direction.y > player.gravity + 0.1)
    ) {
      player.onGround = false
    }
  }

  enemyCollisionReverse() {
    this.enemySprites.sprites.forEach((enemy) => {
      if (spriteCollide(enemy, this.constraintSprites, false)) enemy.reverse()
    })
  }

  scroll() {
    const playerX = this.player.rect.centerx
    const directionX = this.player.direction.x

    if (playerX < this.canvasWidth / 4 && directionX < 0) {
      this.worldShift = this.speed
      this.player.speed = 0
    } else if (
      playerX > this.canvasWidth - this.canvasWidth / 4 &&
      directionX > 0
    ) {
      this.worldShift = -this.speed
      this.player.speed = 0
    } else {
      this.worldShift = 0
      this.player.speed = this.speed
    }
  }

  getPlayerOnGround() {
    if (this.player.onGround) this.playerOnGround = true
    else this.playerOnGround = false
  }

  createLandingParticles() {
    if (
      !this.playerOnGround &&
      this.player.onGround &&
      this.dust.sprites.length === 0
    ) {
      let offset
      if (this.player.facingRight) {
        offset = new Vector2D(10, 15)
      } else {
        offset = new Vector2D(-10, 15)
      }
      const pos = new Vector2D(
        this.player.rect.midbottom.x - offset.x,
        this.player.rect.midbottom.y - offset.y
      )
      const landParticleSprite = new ParticleEffect(
        this.dust,
        pos,
        "land",
        this.assets
      )
    }
  }

  // choose if game start over on fall or just level
  checkDeath() {
    if (this.player.rect.top > SCREEN_HEIGHT) {
      this.createOverworld(this.currentLevel, 0)
      //this.updateHealth(-100)
    }
  }

  checkWin() {
    if (spriteCollide(this.player, this.goalSprite)) {
      this.createOverworld(this.currentLevel, this.newMaxLevel)
    }
  }

  checkCoinCollisions() {
    const coinCollision = spriteHitboxCollide(
      this.player,
      this.coinSprites,
      true
    )
    if (coinCollision) {
      this.coinSound.currentTime = 0
      this.coinSound.play()
      this.updateCoins(coinCollision.value)
    }
  }

  checkEnemyCollisions() {
    const enemyCollision = spriteHitboxCollide(this.player, this.enemySprites)

    if (enemyCollision) {
      const enemy = enemyCollision
      const enemyCenter = enemy.rect.centery
      const enemyTop = enemy.rect.top
      const playerBottom = this.player.rect.bottom
      if (
        enemyTop < playerBottom &&
        playerBottom < enemyCenter &&
        this.player.direction.y >= 0
      ) {
        this.stompSound.currentTime = 0
        this.stompSound.play()
        this.player.direction.y = -13
        const explosionSprite = new ParticleEffect(
          this.explosion,
          enemy.rect.center,
          "explosion",
          this.assets
        )
        enemy.kill()
      } else {
        this.player.getDamage()
      }
    }
  }

  run(dt) {
    this.movementTimer.update()
    //drawn in order

    //sky
    this.sky.draw(this.ctx)
    this.clouds.draw(this.ctx, { dt, shift: this.worldShift })

    //bg palms
    this.bgPalmSprites.update({ dt, shift: this.worldShift })
    this.bgPalmSprites.draw(this.ctx)
    //this.bgPalmSprites.drawRect(this.ctx)

    //dust particles
    this.dust.update({ dt, shift: this.worldShift })
    this.dust.draw(this.ctx)

    //terrain
    this.terrainSprites.update({ dt, shift: this.worldShift })
    this.terrainSprites.draw(this.ctx)
    //this.terrainSprites.drawRect(this.ctx)

    //crates
    this.crateSprites.update({ dt, shift: this.worldShift })
    this.crateSprites.draw(this.ctx)
    //this.crateSprites.drawRect(this.ctx, 'black')

    //grass
    this.grassSprites.update({ dt, shift: this.worldShift })
    this.grassSprites.draw(this.ctx)
    //this.grassSprites.drawRect(this.ctx)

    //enemies & constraints for enemies
    this.enemySprites.update({ dt, shift: this.worldShift })
    this.constraintSprites.update({ dt, shift: this.worldShift })
    this.enemyCollisionReverse()
    //this.constraintSprites.draw(this.ctx)
    this.enemySprites.draw(this.ctx)
    // this.enemySprites.drawRect(this.ctx)
    // this.enemySprites.sprites.forEach((s) => {
    //   this.ctx.strokeStyle = 'black'
    //   this.ctx.lineWidth = 0.1
    //   this.ctx.strokeRect(s.hitbox.x, s.hitbox.y, s.hitbox.w, s.hitbox.h)
    // })
    this.explosion.update({ dt, shift: this.worldShift })
    this.explosion.draw(this.ctx)

    //fg palms
    this.fgPalmSprites.update({ dt, shift: this.worldShift })
    this.fgPalmSprites.draw(this.ctx)
    //this.fgPalmSprites.drawRect(this.ctx)

    //coins
    this.coinSprites.update({ dt, shift: this.worldShift })
    this.coinSprites.draw(this.ctx)
    // this.coinSprites.drawRect(this.ctx)
    // this.coinSprites.sprites.forEach((s) => {
    //   this.ctx.strokeRect(s.hitbox.x, s.hitbox.y, s.hitbox.w, s.hitbox.h)
    // })

    //player&hat
    if (this.allowMovement) this.playerSprite.update({ dt, shift: this.worldShift })
    this.horizontalMovementCollision()
    this.getPlayerOnGround()
    this.verticalMovementCollision()
    this.createLandingParticles()
    this.scroll()
    this.playerSprite.draw(this.ctx)
    this.goalSprite.update({ dt, shift: this.worldShift })
    this.goalSprite.draw(this.ctx)

    //water
    this.water.draw(this.ctx, { dt, shift: this.worldShift })

    this.checkDeath()
    this.checkWin()

    this.checkCoinCollisions()
    this.checkEnemyCollisions()
  }
}
