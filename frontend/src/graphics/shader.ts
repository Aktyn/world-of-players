interface AttributeSchema<AttributeName extends string> {
  name: AttributeName
  size?: number
  type?: number
  normalize?: boolean
  stride?: number
  offset?: number
}

export class Shader<AttributeName extends string> {
  private readonly gl: WebGLRenderingContext
  private readonly program: WebGLProgram

  private readonly attributesPositions: {
    [name: string]: { location: number } & Required<Omit<AttributeSchema<AttributeName>, 'name'>>
  } = {}

  constructor(
    gl: WebGLRenderingContext,
    vertexShaderSource: string,
    fragmentShaderSource: string,
    attributes: AttributeSchema<AttributeName>[],
  ) {
    this.gl = gl

    const vertexShader = this.createShader(gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragmentShaderSource)
    this.program = this.createProgram(vertexShader, fragmentShader) as WebGLProgram

    for (const attribute of attributes) {
      const location = this.gl.getAttribLocation(this.program, attribute.name)
      this.attributesPositions[attribute.name] = {
        location: location,
        size: attribute.size ?? 2,
        type: attribute.type ?? this.gl.FLOAT,
        normalize: attribute.normalize ?? false,
        stride: attribute.stride ?? 0,
        offset: attribute.offset ?? 0,
      }
    }
  }

  destroy() {
    this.gl.deleteProgram(this.program)
  }

  private createShader(type: number, source: string) {
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

  private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    const program = this.gl.createProgram() as WebGLProgram
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

  enableAttribute(attributeName: AttributeName) {
    const attributePosition = this.attributesPositions[attributeName]

    this.gl.enableVertexAttribArray(attributePosition.location)

    this.gl.vertexAttribPointer(
      attributePosition.location,
      attributePosition.size,
      attributePosition.type,
      attributePosition.normalize,
      attributePosition.stride,
      attributePosition.offset,
    )
  }

  private getUniformLocation(name: string) {
    return this.gl.getUniformLocation(this.program, name)
  }

  setUniformInt(name: string, value: number) {
    this.gl.uniform1i(this.getUniformLocation(name), value)
  }

  use() {
    this.gl.useProgram(this.program)
  }
}
