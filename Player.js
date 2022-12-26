class Player extends Sprite {
  constructor(group, pos, animations, ctx, createJumpParticles, updateHealth) {
    super(group)

    // player animation
    this.animations = animations.playerAnimations
    this.frameIndex = 0
    this.animationSpeed = 0.075
    this.image = this.animations["idle"].images[this.frameIndex]
    this.rect = getRect(this.image, "topleft", pos)

    // dust animation
    this.dustRunParticles = animations.dustParticles.run.images
    this.dustFrameIndex = 0
    this.dustAnimationSpeed = 0.075
    this.display = ctx
    this.createJumpParticles = createJumpParticles

    // movement
    this.direction = new Vector2D(0, 0)
    this.speed = 4
    this.gravity = 0.4
    this.jumpSpeed = -13
    this.hitbox = new Rect(
      this.rect.topleft.x,
      this.rect.topleft.y,
      50,
      this.rect.height
    )

    // status
    this.status = "idle"
    this.facingRight = true
    this.onGround = false
    this.onCeiling = false
    this.onLeft = false
    this.onRight = false

    //health
    this.updateHealth = updateHealth
    this.invincible = false
    this.invincibilityDuration = 500
    this.invincibilityTimer = new Timer(
      this.invincibilityDuration,
      () => (this.invincible = false)
    )

    //audio
    this.jumpSound = new Audio("./audio/effects/jump.wav")
    this.jumpSound.volume = 0.01
    this.hitSound = new Audio("./audio/effects/hit.wav")
    this.hitSound.volume = 0.05
  }

  animate() {
    const animation = this.animations[this.status].images

    this.frameIndex += this.animationSpeed
    if (this.frameIndex >= animation.length) {
      this.frameIndex = 0
    }

    this.image = animation[Math.floor(this.frameIndex)]

    if (this.facingRight) {
      this.rect.bottomleft = {
        x: this.hitbox.bottomleft.x,
        y: this.hitbox.bottomleft.y,
      }
    } else {
      this.rect.bottomright = {
        x: this.hitbox.bottomright.x,
        y: this.hitbox.bottomright.y,
      }
    }
    //stop hovering over ground
    this.rect = getRect(this.image, "midbottom", this.rect.midbottom)
  }

  animateDustRun() {
    if (this.status == "run" && this.onGround) {
      this.dustFrameIndex += this.dustAnimationSpeed
      if (this.dustFrameIndex >= this.dustRunParticles.length) {
        this.dustFrameIndex = 0
      }

      const dustParticle =
        this.dustRunParticles[Math.floor(this.dustFrameIndex)]

      if (this.facingRight) {
        const offset = new Vector2D(6, 10)
        const pos = this.rect.bottomleft
        this.display.drawImage(dustParticle, pos.x - offset.x, pos.y - offset.y)
      } else {
        const offset = new Vector2D(6, 10)
        const pos = this.rect.bottomright
        this.mirror(
          this.display,
          dustParticle,
          pos.x - offset.x,
          pos.y - offset.y,
          true,
          false
        )
      }
    }
  }

  input() {
    if (keys.d.pressed) {
      this.direction.x = 1
      this.facingRight = true
    } else if (keys.a.pressed) {
      this.direction.x = -1
      this.facingRight = false
    } else this.direction.x = 0

    //jump
    if (keys.space.pressed && this.onGround) {
      this.jump()
      this.createJumpParticles(this.rect.midbottom)
    }
  }

  getStatus() {
    if (this.direction.y < 0) {
      this.status = "jump"
    } else if (this.direction.y > this.gravity + 0.1) {
      this.status = "fall"
    } else {
      if (this.direction.x != 0) {
        this.status = "run"
      } else {
        this.status = "idle"
      }
    }
  }

  applyGravity() {
    this.direction.y += this.gravity
    this.hitbox.y += this.direction.y
  }

  jump() {
    this.direction.y = this.jumpSpeed
    this.jumpSound.currentTime = 0
    this.jumpSound.play()
  }

  getDamage() {
    if (!this.invincible) {
      this.hitSound.currentTime = 0
      this.hitSound.play()
      this.updateHealth(-10)
      this.invincible = true
      this.invincibilityTimer.activate()
    }
  }

  waveValue() {
    const value = Math.sin(Date.now())
    return Math.abs(value)
  }

  mirror(ctx, image, x = 0, y = 0, horizontal = false, vertical = false) {
    ctx.save() // save the current canvas state
    ctx.setTransform(
      horizontal ? -1 : 1,
      0, // set the direction of x axis
      0,
      vertical ? -1 : 1, // set the direction of y axis
      x + (horizontal ? image.width : 0), // set the x origin
      y + (vertical ? image.height : 0) // set the y origin
    )
    ctx.drawImage(image, 0, 0)
    ctx.restore() // restore the state as it was when this function was called
  }

  draw(ctx) {
    ctx.save()
    //ctx.fillRect(this.hitbox.x, this.hitbox.y, this.hitbox.w, this.hitbox.h)
    if (this.invincibilityTimer.active)
      ctx.globalAlpha = this.waveValue() //opacity flicker
    else ctx.globalAlpha = 1
    if (this.facingRight) {
      ctx.drawImage(this.image, this.rect.x, this.rect.y)
    } else {
      this.mirror(ctx, this.image, this.rect.x, this.rect.y, true, false)
    }
    ctx.restore()
  }

  update(dt) {
    this.input()
    this.getStatus()
    this.invincibilityTimer.update()
    this.waveValue()
    this.animate()
    this.animateDustRun()
  }
}
