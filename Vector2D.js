class Vector2D {
  constructor(x, y) {
    this._x = x
    this._y = y
  }

  get x() {
    return this._x
  }
  set x(value) {
    this._x = value
  }

  get y() {
    return this._y
  }
  set y(value) {
    this._y = value
  }

  get magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  subtract(other) {
    const x = this._x - other.x
    const y = this._y - other.y
    return new Vector2D(x, y)
  }

  normalize() {    
    const m = this.magnitude   
    this._x = this._x / m
    this._y = this._y / m
  }
}
