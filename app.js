let game

const initGame = () => {
  game = new Game(
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
    assets,
    layers,
    tiles,
    gameObjects,
    levels
  )
  game.run()
  //game.stop()
}

/**
 * import assets here and preload images
 */
levels = {
  0: {
    data: "./levels/my_levels/level_0.json",
    nodePos: {
      x: 110,
      y: 400,
    },
    nodeGraphics: './graphics/overworld/0',
    unlock: 1,
  },
  1: {
    data: "./levels/my_levels/level_1.json",
    nodePos: {
      x: 300,
      y: 220,
    },
    nodeGraphics: './graphics/overworld/1',
    unlock: 2,
  },
  2: {
    data: "./levels/my_levels/level_2.json",
    nodePos: {
      x: 480,
      y: 610,
    },
    nodeGraphics: './graphics/overworld/2',
    unlock: 3,
  },
  3: {
    data: "./levels/my_levels/level_3.json",
    nodePos: {
      x: 610,
      y: 350,
    },
    nodeGraphics: './graphics/overworld/3',
    unlock: 4,
  },
  4: {
    data: "./levels/my_levels/level_4.json",
    nodePos: {
      x: 880,
      y: 210,
    },
    nodeGraphics: './graphics/overworld/4',
    unlock: 5,
  },
  5: {
    data: "./levels/my_levels/level_5.json",
    nodePos: {
      x: 1050,
      y: 400,
    },
    nodeGraphics: './graphics/overworld/5',
    unlock: 5,
  },
}

const assets = {
  playerAnimations: {
    idle: { images: [], length: 5 },
    run: { images: [], length: 6 },
    jump: { images: [], length: 3 },
    fall: { images: [], length: 1 },
  },
  dustParticles: {
    land: { images: [], length: 5 },
    jump: { images: [], length: 6 },
    run: { images: [], length: 5 },
  },
  coins: {
    gold: { images: [], length: 4 },
    silver: { images: [], length: 4 },
  },
  palms: {
    palm_bg: { images: [], length: 4 },
    palm_large: { images: [], length: 4 },
    palm_small: { images: [], length: 4 },
  },
  enemy: {
    explosion: { images: [], length: 7 },
    run: { images: [], length: 6 },
  },
  decoration: {
    sky: {
      bottom: new Image(),
      middle: new Image(),
      top: new Image(),
    },
    water: { images: [], length: 4 },
    clouds: { images: [], length: 3}
  },
  overworld: {
    0: { images: [], length: 4 },
    1: { images: [], length: 4 },
    2: { images: [], length: 4 },
    3: { images: [], length: 4 },
    4: { images: [], length: 4 },
    5: { images: [], length: 4 },
    clouds: { images: [], length: 3 },
    palms: { images: [], length: 8 },
  },
  ui: {
    coin: new Image(),
    healthBar: new Image()
  },
  hat: new Image(),

  
}

//level 0
//MANUALLY!, keys named after tilesets, all tiles are tilesize
const tilesetImages = {
  coinTiles: importFromSource("./graphics/coins/coin_tiles.png"),
  enemyTiles: importFromSource("./graphics/enemy/setup_tile.png"),
  grassTiles: importFromSource("./graphics/decoration/grass/grass.png"),
  playerTiles: importFromSource("./graphics/character/setup_tiles.png"),
  terrainTiles: importFromSource("./graphics/terrain/terrain_tiles.png"),
}

const gameObjectImages = {
  crates: importFromSources(["./graphics/terrain/crate.png"]),
  palms: importFromSources([
    "./graphics/terrain/palm_small/1.png",
    "./graphics/terrain/palm_large/1.png",
    "./graphics/terrain/palm_bg/1.png",
  ]),
}

//levels
const layers = {
  0: {},
  1: {},
  2: {},
  3: {},
  4: {},
  5: {},
}

const tilesets = {
  coinTiles: new Tileset("coinTiles", tilesetImages.coinTiles, 17, 2, 2),
  enemyTiles: new Tileset("enemyTiles", tilesetImages.enemyTiles, 30, 2, 2),
  grassTiles: new Tileset("grassTiles", tilesetImages.grassTiles, 19, 5, 5),
  playerTiles: new Tileset("playerTiles", tilesetImages.playerTiles, 28, 2, 2),
  terrainTiles: new Tileset(
    "terrainTiles",
    tilesetImages.terrainTiles,
    1,
    16,
    4
  ),
}
//not standard tilesize
const gameObjectSets = {
  crates: new gameObjectSet("crates", gameObjectImages.crates, 27, 1, 0),
  palms: new gameObjectSet("palms", gameObjectImages.palms, 24, 3, 0),
}

let tiles = {} // {gid: Tile}
let gameObjects = {} // {gid: GameObject}

Object.keys(tilesets).forEach((tileset) => {
  tiles = { ...tiles, ...tilesets[tileset].get_tiles() }
})

const promises = []

//load tileset images
Object.values(tilesetImages).forEach((image) => {
  promises.push(
    new Promise((resolve, reject) => {
      image.onload = () => {
        resolve(true)
      }
    })
  )
})

//load gameobject images
Object.values(gameObjectImages).forEach((images) => {
  images.forEach((image) => {
    promises.push(
      new Promise((resolve, reject) => {
        image.onload = () => {
          resolve(true)
        }
      })
    )
  })
})

//load levels
for (let i = 0; i < 6; i++) {
  promises.push(
    new Promise((resolve, reject) => {
      fetch(levels[i].data)
        .then((response) => response.json())
        .then((json) => {
          json.layers.forEach((layer) => {
            (layers[i])[layer.name] = new Layer( 
              layer.name,
              layer.id,
              layer.data,
              layer.height,
              layer.width
            )
          })
        })
        .then(resolve(true))
    })
  )
}

//load overworld images
Object.values(levels).forEach((level, index) => {
  const images = importFolder(
    level.nodeGraphics,
    assets.overworld[index].length
  )
  assets.overworld[index].images = images

  images.forEach((image) => {
    promises.push(
      new Promise((resolve, reject) => {
        image.onload = () => {
          resolve(true)
        }
      })
    )
  })
})

//overworld palms
const overworldPalmsFullPath = "./graphics/overworld/palms"
const overworldPalmsImages = importFolder(overworldPalmsFullPath, assets.overworld.palms.length)
assets.overworld.palms.images = overworldPalmsImages
overworldPalmsImages.forEach((image) => {
  promises.push(
    new Promise((resolve, reject) => {
      image.onload = () => {
        resolve(true)
      }
    })
  )
})

//overworld clouds
const overworldCloudsFullPath = "./graphics/overworld/clouds"
const overworldCloudImages = importFolder(overworldCloudsFullPath, assets.overworld.clouds.length)
assets.overworld.clouds.images = overworldCloudImages
overworldCloudImages.forEach((image) => {
  promises.push(
    new Promise((resolve, reject) => {
      image.onload = () => {
        resolve(true)
      }
    })
  )
})

// playerAnimations
Object.keys(assets.playerAnimations).forEach((animation) => {
  const full_path = "./graphics/character/" + animation
  const images = importFolder(
    full_path,
    assets.playerAnimations[animation].length
  )
  assets.playerAnimations[animation].images = images
  images.forEach((image) => {
    promises.push(
      new Promise((resolve, reject) => {
        image.onload = () => {
          resolve(true)
        }
      })
    )
  })
})

// dustParticles
Object.keys(assets.dustParticles).forEach((animation) => {
  const full_path = "./graphics/character/dust_particles/" + animation
  const images = importFolder(full_path, assets.dustParticles[animation].length)
  assets.dustParticles[animation].images = images
  images.forEach((image) => {
    promises.push(
      new Promise((resolve, reject) => {
        image.onload = () => {
          resolve(true)
        }
      })
    )
  })
})

// coins
Object.keys(assets.coins).forEach((animation) => {
  const full_path = "./graphics/coins/" + animation
  const images = importFolder(full_path, assets.coins[animation].length)
  assets.coins[animation].images = images
  images.forEach((image) => {
    promises.push(
      new Promise((resolve, reject) => {
        image.onload = () => {
          resolve(true)
        }
      })
    )
  })
})

// palms
Object.keys(assets.palms).forEach((animation) => {
  const full_path = "./graphics/terrain/" + animation
  const images = importFolder(full_path, assets.palms[animation].length)
  assets.palms[animation].images = images
  images.forEach((image) => {
    promises.push(
      new Promise((resolve, reject) => {
        image.onload = () => {
          resolve(true)
        }
      })
    )
  })
})

// enemy
Object.keys(assets.enemy).forEach((animation) => {
  const full_path = "./graphics/enemy/" + animation
  const images = importFolder(full_path, assets.enemy[animation].length)
  assets.enemy[animation].images = images
  images.forEach((image) => {
    promises.push(
      new Promise((resolve, reject) => {
        image.onload = () => {
          resolve(true)
        }
      })
    )
  })
})

//hat
assets.hat.src = "./graphics/character/hat.png"
promises.push(
  new Promise((resolve, reject) => {
    assets.hat.onload = () => {
      resolve(true)
    }
  })
)

//sky
assets.decoration.sky.bottom.src = "./graphics/decoration/sky/sky_bottom.png"
promises.push(
  new Promise((resolve, reject) => {
    assets.decoration.sky.bottom.onload = () => {
      resolve(true)
    }
  })
)
assets.decoration.sky.middle.src = "./graphics/decoration/sky/sky_middle.png"
promises.push(
  new Promise((resolve, reject) => {
    assets.decoration.sky.middle.onload = () => {
      resolve(true)
    }
  })
)
assets.decoration.sky.top.src = "./graphics/decoration/sky/sky_top.png"
promises.push(
  new Promise((resolve, reject) => {
    assets.decoration.sky.top.onload = () => {
      resolve(true)
    }
  })
)

//water
const waterFullPath = "./graphics/decoration/water"
const waterImages = importFolder(waterFullPath, assets.decoration.water.length)
assets.decoration.water.images = waterImages
waterImages.forEach((image) => {
  promises.push(
    new Promise((resolve, reject) => {
      image.onload = () => {
        resolve(true)
      }
    })
  )
})

//coulds
const cloudsFullPath = "./graphics/decoration/clouds"
const cloudImages = importFolder(cloudsFullPath, assets.decoration.clouds.length)
assets.decoration.clouds.images = cloudImages
cloudImages.forEach((image) => {
  promises.push(
    new Promise((resolve, reject) => {
      image.onload = () => {
        resolve(true)
      }
    })
  )
})

//ui
assets.ui.coin.src = "./graphics/ui/coin.png"
promises.push(
  new Promise((resolve, reject) => {
    assets.ui.coin.onload = () => {
      resolve(true)
    }
  })
)
assets.ui.healthBar.src = "./graphics/ui/health_bar.png"
promises.push(
  new Promise((resolve, reject) => {
    assets.ui.healthBar.onload = () => {
      resolve(true)
    }
  })
)

/**
 * start game after imports
 */

Promise.all(promises).then((result) => {
  //console.log(assets);
  Object.keys(gameObjectSets).forEach((set) => {
    gameObjects = { ...gameObjects, ...gameObjectSets[set].get_objects() }
  })
  //

  initGame()
})
