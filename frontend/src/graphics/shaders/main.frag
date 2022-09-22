#version 300 es
// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;

// we need to declare an output for the fragment shader
out vec4 outColor;

in vec3 b_position;

void main() {
  // Just set the output to a constant reddish-purple
  outColor = vec4(b_position * 1.9, 1);
}