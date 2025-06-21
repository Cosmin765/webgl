#version 300 es

uniform mat4 u_projectionMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_modelMatrix;

uniform mat4 u_modelMatrixLight; // inverted and transposed
uniform vec3 u_lightWorldPosition;  // for point light
uniform vec3 u_viewWorldPosition;  // position of the camera

in vec4 a_color;
in vec3 a_position;
in vec3 a_normal;

in vec2 a_texCoord;
out vec2 v_texCoord;

out vec4 v_color;
out vec3 v_normal;
out vec3 v_surfaceToLight;
out vec3 v_surfaceToView;

void main() {
    v_color = a_color;
    v_normal = mat3(u_modelMatrixLight) * a_normal;

    v_texCoord = a_texCoord;

    vec3 surfaceWorldPosition = (u_modelMatrix * vec4(a_position, 0)).xyz;

    v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;
    v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;

    gl_Position = (u_projectionMatrix * u_viewMatrix * u_modelMatrix * vec4(a_position, 1));
}