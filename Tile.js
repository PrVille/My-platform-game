class Tile {
  constructor(image, gid, sx, sy, width = TILE_SIZE, height=TILE_SIZE) {
    this.image = image
    this.gid = gid
    this.sx = sx
    this.sy = sy
    this.width = width
    this.height = height
  }
}
