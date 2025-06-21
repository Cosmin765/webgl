#version 300 es
precision highp float;

uniform highp vec4 u_color;
uniform vec3 u_lightDirReversed;
uniform bool u_isSprite;
uniform bool u_useUniformColor;
uniform float u_shininess;

uniform sampler2D u_image;

in vec4 v_color;
in vec3 v_normal;
in vec2 v_texCoord;
in vec3 v_surfaceToLight;
in vec3 v_surfaceToView;


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
    float directionalLight = dot(normal, u_lightDirReversed);

    vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
    vec3 surfaceToViewDirection = normalize(v_surfaceToView);
    float pointLight = dot(normal, surfaceToLightDirection);
    float specular = 0.0;
    if (pointLight > 0.0) {
      vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);
      specular = pow(dot(normal, halfVector), u_shininess);
    }

    float light = pointLight + 0.5 * directionalLight;
    outColor.rgb *= light;
    outColor.rgb += specular;
  }
}