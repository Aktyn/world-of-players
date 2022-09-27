//TODO: extend with generic Vector class
export class Vec2 {
  private readonly values: [number, number] = [0, 0]

  constructor(x: number, y: number) {
    this.values[0] = x
    this.values[1] = y
  }
}
