const logger = (name) => {
  console.log(`hi ${name}`)
}

const importFolder = (path, amount) => {
  const img_list = []
  for (let i = 1; i < amount + 1; i++) {
    const fullPath = path + "/" + i + ".png"
    const img = new Image()
    img.src = fullPath
    img_list.push(img)
  }
  return img_list
}

const importFromSources = (paths) => {
  const img_list = []
  paths.forEach((path) => {
    const img = new Image()
    img.src = path
    img_list.push(img)
  })
  return img_list
}

const importFromSource = (path) => {
  const img = new Image()
  img.src = path
  return img
}

const randomIntFromInterval = (min, max) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const magnitude = (vector) => {
  return Math.sqrt(vector.x * vector.x + vector.y * vector.y)
}

const normalize = (vector) => {
  const v = vector
  const m = magnitude(v)
  v.x = v.x / m
  v.y = v.y / m
  return v
}

const log_rect = (rect) => {
  console.log("rect :>> ", rect)
  console.log(rect.centerx)
  rect.centerx += 1
  console.log(rect.centerx)
}

const spriteCollide = (sprite, group, dokill) => {
  for (i = 0; i < group.sprites.length; i++) {
    if (group.sprites[i].rect.colliderect(sprite.rect)) {
      const sprite = group.sprites[i]
      if (dokill) group.sprites[i].kill()
      return sprite
    }
  }
  return false
}

const spriteHitboxCollide = (sprite, group, dokill) => {
  if (!sprite.hitbox) {
    console.log("no hitbox found on", group.sprites[i]);
    return false
  }

  for (i = 0; i < group.sprites.length; i++) {

    if (!group.sprites[i].hitbox) {
      console.log("no hitbox found on", group.sprites[i]);
      return false
    }

    if (group.sprites[i].hitbox.colliderect(sprite.hitbox)) {
      const sprite = group.sprites[i]
      if (dokill) group.sprites[i].kill()
      return sprite
    }
  }
  return false
}

const getRect = (image, placement, vector, crop) => {
  // 16x16
  const x = vector.x
  const y = vector.y
  let w
  let h
  if (crop) {
    //console.log(crop);
    w = crop.width
    h = crop.height
  } else {
    w = image.width
    h = image.height
  }

  switch (placement) {
    case "center": {
      const rect = new Rect(x, y, w, h)
      rect.center = { x, y }
      return rect
    }
    case "midbottom": {
      const rect = new Rect(x, y, w, h)
      rect.midbottom = { x, y }
      return rect
    }
    case "midtop": {
      const rect = new Rect(x, y, w, h)
      rect.midtop = { x, y }
      return rect
    }
    case "topleft": {
      const rect = new Rect(x, y, w, h)
      rect.topleft = { x, y }
      return rect
    }
    case "topright": {
      const rect = new Rect(x, y, w, h)
      rect.topright = { x, y }
      return rect
    }
    case "bottomright": {
      const rect = new Rect(x, y, w, h)
      rect.bottomright = { x, y }
      return rect
    }
    case "bottomleft": {
      const rect = new Rect(x, y, w, h)
      rect.bottomleft = { x, y }
      return rect
    }
    default: {
      console.log("not implemented get rect");
      
      break
    }
  }
}
