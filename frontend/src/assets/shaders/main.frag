#version 300 es
precision highp float;

in vec2 v_imageCoordinates;

uniform sampler2D u_image;

out vec4 outColor;

void main() {
  outColor = texture(u_image, v_imageCoordinates);
}