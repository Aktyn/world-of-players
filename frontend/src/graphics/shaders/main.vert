#version 300 es
// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;

out vec3 b_position;

// all shaders have a main function
void main() {
  gl_Position = a_position;

  b_position = a_position.xyz;
}