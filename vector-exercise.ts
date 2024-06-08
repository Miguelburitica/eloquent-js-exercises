class Vec {
  x: number
  y: number

  constructor ({ x, y }: { x: number, y: number }) {
    this.x = x
    this.y = y
  }

  plus = (vector: Vec) => {
    return new Vec({
      x: vector.x + this.x,
      y: vector.y + this.y
    })
  }

  minus = (vector: Vec) => {
    return new Vec({
      x: this.x - vector.x,
      y: this.y - vector.y
    })
  }

  /**
   * Distance from origin (0,0)
   */
  get length() {
    return Math.sqrt(this.x**2 + this.y**2)
  }
}

const vector1 = new Vec({ x: 4, y: 4 })
const vector2 = new Vec({ x: -2, y: 2 })

console.log(vector1.plus(vector2))
console.log(vector2.minus(vector1))
