import type { Point } from '@world-of-players/shared'

export class Renderer {
  private readonly canvas: HTMLCanvasElement
  private readonly gl: WebGL2RenderingContext
  private readonly resizeListener = this.onResize.bind(this)
  private readonly resolution = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  private readonly rectPosition: Point = {
    x: 0,
    y: 0,
  }

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.canvas.width = this.resolution.width
    this.canvas.height = this.resolution.height

    this.gl = this.canvas.getContext('webgl2', {
      alpha: false,
    }) as WebGL2RenderingContext

    window.addEventListener('resize', this.resizeListener)
  }

  destroy() {
    window.removeEventListener('resize', this.resizeListener)
  }

  draw() {
    //TODO
    console.log(this.rectPosition)
    this.gl.clearColor(255, 0, 0, 255)
  }

  onResize() {
    this.resolution.width = window.innerWidth
    this.resolution.height = window.innerHeight
  }
}
