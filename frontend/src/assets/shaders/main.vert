#version 300 es
in vec2 a_imageCoordinates;
in vec2 a_position;

out vec2 v_imageCoordinates;

void main() {
  v_imageCoordinates = a_imageCoordinates;

  gl_Position = vec4(a_position, 0, 1.);
}