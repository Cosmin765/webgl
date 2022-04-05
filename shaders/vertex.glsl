#version 300 es

uniform mat4 u_projectionMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_modelMatrix;

uniform mat4 u_modelMatrixLight; // inversed and transposed

in vec4 a_color;
in vec3 a_position;
in vec3 a_normal;

out vec4 v_color;
out vec3 v_normal;

void main() {
    v_color = a_color;
    v_normal = mat3(u_modelMatrixLight) * a_normal;

    gl_Position = (u_projectionMatrix * u_viewMatrix * u_modelMatrix * vec4(a_position, 1));
}