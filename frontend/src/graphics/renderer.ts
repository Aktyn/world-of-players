import { randomFloat } from '@world-of-players/shared'
import { loadResources, resources } from './resources'

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

  createShader(type: number, source: string) {
    const shader = this.gl.createShader(type) as WebGLShader
    this.gl.shaderSource(shader, source)
    this.gl.compileShader(shader)
    const success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)

    if (!success) {
      console.log(this.gl.getShaderInfoLog(shader))
      this.gl.deleteShader(shader)
      throw new Error('Failed to compile shader')
    }

    return shader
  }

  createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    const program = this.gl.createProgram() as WebGLProgram
    // this.gl.deleteProgram(program) // TODO: remember to call it when shader won't be needed anymore
    this.gl.attachShader(program, vertexShader)
    this.gl.attachShader(program, fragmentShader)
    this.gl.linkProgram(program)
    const success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS)
    if (!success) {
      console.log(this.gl.getProgramInfoLog(program))
      this.gl.deleteProgram(program)
      throw new Error('Failed to create program')
    }

    return program
  }

  destroy() {
    window.removeEventListener('resize', this.resizeListener)
  }

  draw() {
    if (!resources.shaders.mainFragment || !resources.shaders.mainVertex) {
      throw new Error('Shaders are not loaded')
    }

    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, resources.shaders.mainVertex)
    const fragmentShader = this.createShader(
      this.gl.FRAGMENT_SHADER,
      resources.shaders.mainFragment,
    )

    const program = this.createProgram(vertexShader, fragmentShader) as WebGLProgram

    const positionAttributeLocation = this.gl.getAttribLocation(program, 'a_position')

    const positionBuffer = this.gl.createBuffer()
    const colorBuffer = this.gl.createBuffer()
    //GL.deleteBuffer(vertex_buff); //TODO: remember to call it when buffer won't be needed anymore

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer)

    // const vao = this.gl.createVertexArray() //Vertex Array Object
    // this.gl.bindVertexArray(vao)

    this.gl.enableVertexAttribArray(positionAttributeLocation)

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    const size = 2 // 2 components per iteration
    const type = this.gl.FLOAT //the data is 32bit float
    const normalize = false // don't normalize the data
    const stride = 0 // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0 // start at the beginning of the buffer

    this.gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)

    this.gl.viewport(0, 0, this.resolution.width, this.resolution.height)

    // Clear the canvas
    this.gl.clearColor(0, 0, 0, 0)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)

    // Tell it to use our program (pair of shaders)
    this.gl.useProgram(program)

    // Bind the attribute/buffer set we want.
    // this.gl.bindVertexArray(vao)

    // const colorLocation = this.gl.getUniformLocation(program, 'u_color')

    for (let i = 0; i < 1; i++) {
      this.setRectangle(
        randomFloat(-1, 1),
        randomFloat(-1, 1),
        randomFloat(-1, 1),
        randomFloat(-1, 1),
      )

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer)
      const colorAttributeLocation = this.gl.getAttribLocation(program, 'a_color')
      this.gl.enableVertexAttribArray(colorAttributeLocation)
      this.gl.vertexAttribPointer(colorAttributeLocation, 2, this.gl.FLOAT, false, 0, 0)
      // this.gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1)
      //!
      this.gl.bufferData(
        this.gl.ARRAY_BUFFER,
        new Float32Array([1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1]),
        this.gl.STATIC_DRAW,
      )
      const primitiveType = this.gl.TRIANGLE_FAN
      const offsetP = 0
      const count = 4
      this.gl.drawArrays(primitiveType, offsetP, count)
    }

    // TODO: experiment with this.gl.drawElements(this.gl.TRIANGLE_FAN, 3, this.gl.UNSIGNED_SHORT, 0)
    // TODO: use GL.drawArrays for rendering particles and drawElements for rendering objects
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
