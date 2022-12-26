class Layer {
  constructor(name, id, data, height, width) {
    this.name = name
    this.id = id
    this.data = data
    this.height = height
    this.width = width
  }

  getTiles(tiles) {
    const res = []
    const columns = this.data.length / VERTICAL_TILE_NUMBER
    const rows = VERTICAL_TILE_NUMBER

    let index = 0
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const mapGid = this.data[index]
        if (mapGid !== 0) {
          res.push({
            dx: col * TILE_SIZE,
            dy: row * TILE_SIZE,
            tile: tiles[this.data[index]],
          })
        }
        index++
      }
    }
    return res
  }

  getObjects(gameObjects) {
    const res = []
    const columns = this.data.length / VERTICAL_TILE_NUMBER
    const rows = VERTICAL_TILE_NUMBER

    let index = 0
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const mapGid = this.data[index]
        if (mapGid !== 0) {
          res.push({
            dx: col * TILE_SIZE,
            dy: row * TILE_SIZE,
            gameObject: gameObjects[this.data[index]],
          })
        }
        index++
      }
    }
    return res
  }
}
