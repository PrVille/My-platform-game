class ParticleEffect extends Sprite {
  constructor(group, pos, type, assets) {
    super(group)    
    this.frameIndex = 0
    this.animationSpeed = 0.25
    if (type === 'jump') {
        this.frames = assets.dustParticles.jump.images
    }
    if (type === 'land') {
        this.frames = assets.dustParticles.land.images
    }
    if (type === 'explosion') [
      this.frames = assets.enemy.explosion.images
    ]
    this.image = this.frames[this.frameIndex]
    this.rect = getRect(this.image, 'center', pos)
  }

  animate() {
    this.frameIndex += this.animationSpeed
    if (this.frameIndex >= this.frames.length) {
        this.kill()
    } else {
        this.image = this.frames[Math.floor(this.frameIndex)]
    }
  }

  update({shift}) {   
    this.animate()
    this.rect.x += shift
  }

}
