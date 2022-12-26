class Surface {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.color = 'black'
  }

  fill(value) {
      this.color = value
  }

  getRect(pos, placement) {     
      const rect = new Rect(pos.x, pos.y, this.width, this.height)
      switch (placement) {
        case 'center':
          rect.center = { x: pos.x, y: pos.y }
          break
        default:
          rect.topleft = { x: pos.x, y: pos.y }
          break
      }        
      return rect
  }
}
