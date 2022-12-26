class Node extends Sprite {
  constructor(group, pos, status, frames, levelNumber) {
    super(group)
    this.frames = frames
    this.frameIndex = 0
    this.image = this.frames[this.frameIndex]
    this.levelNumber = levelNumber
    this.status
    if (status === "available") {
      this.status = 'available'
    } else {
      this.status = 'locked'
    }
    this.rect = getRect(this.image, 'center', pos)    
  }

  draw(ctx) {
    if (this.status === 'locked') {
      ctx.save()
      ctx.globalAlpha = 0.1 //opacity
      ctx.drawImage(this.image, this.rect.x, this.rect.y)
      ctx.restore()
    } else ctx.drawImage(this.image, this.rect.x, this.rect.y)
  }

  animate() {
    this.frameIndex += 0.075
    if (this.frameIndex >= this.frames.length) {
      this.frameIndex = 0
    }
    this.image = this.frames[Math.floor(this.frameIndex)]
  }
  
  update(currentLevel) {
    if (this.status === 'available' && currentLevel == this.levelNumber) {
      this.animate()
    }
  }
}

class Icon extends Sprite {
  constructor(group, pos, assets) {
    super(group)
    this.image = assets.hat
    this.rect = getRect(this.image, 'center', pos)
  }
}

class Overworld {
  constructor(startLevel, maxLevel, ctx, createLevel, assets) {
    //setup
    this.ctx = ctx
    this.maxLevel = maxLevel
    this.currentLevel = startLevel
    this.createLevel = createLevel
    this.assets = assets   

    //sprites
    this.nodes = new Group()
    this.icon = new Group()
    this.sky = new Sky(8, this.assets, 'overworld')

    this.setupNodes()
    this.setupIcon()

    //time
    this.allowInput = false
    this.inputTimer = new Timer(300, () => this.allowInput = true)
    this.inputTimer.activate()
  }

  setupNodes() {
    Object.values(levels).forEach((level, index) => {      
      if (index <= this.maxLevel) {
        new Node(this.nodes, level.nodePos, "available", this.assets.overworld[index].images, index)
      } else {
        new Node(this.nodes, level.nodePos, "locked", this.assets.overworld[index].images, index)
      }
    })
  }

  setupIcon() {
    const iconSprite = new Icon(
      this.icon,
      this.nodes.sprites[this.currentLevel].rect.center,
      this.assets
    )
  }

  input() {   
    if (this.allowInput) {
      if (keys.d.pressed && this.currentLevel < this.maxLevel) {
        this.allowInput = false
        this.inputTimer.activate()
        this.icon.sprites[0].rect.center = this.nodes.sprites[this.currentLevel + 1].rect.center,
        this.currentLevel += 1
      } else if (keys.a.pressed && this.currentLevel > 0) {
        this.allowInput = false
        this.inputTimer.activate()
        this.icon.sprites[0].rect.center = this.nodes.sprites[this.currentLevel -1].rect.center,
        this.currentLevel -= 1
      } else if (keys.space.pressed) {
        this.createLevel(this.currentLevel)
      }
    }
  }

  drawPaths() {
    this.ctx.lineWidth = 5
    this.ctx.strokeStyle = "#a04f45"
    this.ctx.beginPath()
    this.ctx.moveTo(levels[0].nodePos.x, levels[0].nodePos.y)
    Object.values(levels).forEach((level, index) => {
      const x = level.nodePos.x
      const y = level.nodePos.y
      if (index <= this.maxLevel) {
        this.ctx.lineTo(x, y)
      }
    })
    this.ctx.stroke()
  }

  run() {
    this.input()
    this.inputTimer.update()
    this.nodes.update(this.currentLevel)
    this.sky.draw(this.ctx)

    this.drawPaths()
    this.nodes.draw(this.ctx)
    this.icon.draw(this.ctx)
  }
}
