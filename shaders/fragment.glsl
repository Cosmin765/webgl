#version 300 es
precision highp float;

uniform highp vec4 u_color;
uniform vec3 u_lightDirReversed;

in vec4 v_color;
in vec3 v_normal;

out vec4 outColor;

void main() {
  // outColor = v_color;
  outColor = u_color;

  vec3 normal = normalize(v_normal);

  float light = dot(normal, u_lightDirReversed);

  outColor.rgb *= light;
}