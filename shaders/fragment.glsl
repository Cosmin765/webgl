#version 300 es
precision highp float;

uniform highp vec4 u_color;
uniform vec3 u_lightDirReversed;
uniform bool u_isSprite;
uniform bool u_useUniformColor;

uniform sampler2D u_image;

in vec4 v_color;
in vec3 v_normal;

in vec2 v_texCoord;

out vec4 outColor;

void main() {
  if(u_isSprite) {
    outColor = texture(u_image, v_texCoord);
  } else {
    if (u_useUniformColor) {
      outColor = u_color;
    } else {
      outColor = v_color;
    }
    vec3 normal = normalize(v_normal);
    float light = dot(normal, u_lightDirReversed);
    outColor.rgb *= light;
  }
}