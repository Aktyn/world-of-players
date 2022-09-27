export interface Point {
  x: number
  y: number
}

export const randomFloat = (min: number, max: number) => Math.random() * (max - min) + min
