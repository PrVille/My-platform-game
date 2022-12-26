class Tileset {
  constructor(name, image, firstGid, tileCount, columns) {
    this.name = name
    this.image = image
    this.firstGid = firstGid
    this.lastGid = firstGid + tileCount - 1
    this.tileCount = tileCount
    this.columns = columns
    this.rows = tileCount / columns
  }

  get_tiles() {
    let gid = this.firstGid
    const tiles = {}
    
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        const sx = col * TILE_SIZE
        const sy = row * TILE_SIZE

        const tile = new Tile(this.image, gid, sx, sy)
        tiles[gid] = tile
        gid++
      }
    }
    return tiles
  }
}
