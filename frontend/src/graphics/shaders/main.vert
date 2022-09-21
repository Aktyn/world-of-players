#version 300 es
// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;
in vec3 a_color;

out vec3 col;

// all shaders have a main function
void main() {
  col = a_color;
  gl_Position = a_position;
}