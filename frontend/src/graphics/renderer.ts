// import { randomFloat } from '@world-of-players/shared'
import { loadResources, resources } from './resources'
import { Shader } from './shader'

export class Renderer {
  private readonly canvas: HTMLCanvasElement
  private readonly gl: WebGL2RenderingContext
  private readonly resizeListener = this.onResize.bind(this)
  private readonly resolution = {
    width: window.innerWidth,
    height: window.innerHeight,
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

  async downloadResources() {
    await loadResources()
  }

  destroy() {
    window.removeEventListener('resize', this.resizeListener)
  }

  draw() {
    if (!resources.shaders.mainFragment || !resources.shaders.mainVertex) {
      throw new Error('Shaders are not loaded')
    }

    this.gl.viewport(0, 0, this.resolution.width, this.resolution.height)
    // const colorLocation = this.gl.getUniformLocation(program, 'u_color')
    // Clear the canvas
    this.gl.clearColor(0, 0, 0, 0)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)

    const mainShader = new Shader(
      this.gl,
      resources.shaders.mainVertex,
      resources.shaders.mainFragment,
      [{ name: 'a_position' }],
    )

    // Tell it to use our program (pair of shaders)
    mainShader.use()

    const positionBuffer = this.gl.createBuffer()
    //GL.deleteBuffer(vertex_buff); //TODO: remember to call it when buffer won't be needed anymore

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer)

    // const vao = this.gl.createVertexArray() //Vertex Array Object
    // this.gl.bindVertexArray(vao)

    mainShader.enableAttribute('a_position')

    // Bind the attribute/buffer set we want.
    // this.gl.bindVertexArray(vao)

    for (let i = 0; i < 1; i++) {
      this.setRectangle(
        0, //randomFloat(-1, 1),
        0, //randomFloat(-1, 1),
        1, //randomFloat(-1, 1),
        1, //randomFloat(-1, 1),
      )

      // this.gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1)

      const primitiveType = this.gl.TRIANGLE_FAN
      const offsetP = 0
      const count = 4
      this.gl.drawArrays(primitiveType, offsetP, count)
    }

    // TODO: experiment with this.gl.drawElements(this.gl.TRIANGLE_FAN, 3, this.gl.UNSIGNED_SHORT, 0)
    // TODO: use GL.drawArrays for rendering particles and drawElements for rendering objects
    // setTimeout(() => this.draw.call(this), 500)
  }

  setRectangle(x: number, y: number, width: number, height: number) {
    const x1 = x
    const x2 = x + width
    const y1 = y
    const y2 = y + height

    // NOTE: gl.bufferData(gl.ARRAY_BUFFER, ...) will affect
    // whatever buffer is bound to the `ARRAY_BUFFER` bind point
    // but so far we only have one buffer. If we had more than one
    // buffer we'd want to bind that buffer to `ARRAY_BUFFER` first.

    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([x1, y1, x1, y2, x2, y2, x2, y1]),
      this.gl.STATIC_DRAW,
    )
  }

  onResize() {
    this.resolution.width = window.innerWidth
    this.resolution.height = window.innerHeight
  }
}
