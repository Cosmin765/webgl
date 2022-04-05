import { loadText } from "./utils.js";

class Shader {
    private gl: WebGL2RenderingContext;
    private raw: WebGLShader;

    constructor(gl: WebGL2RenderingContext, type: number) {
        this.gl = gl;
        this.raw = gl.createShader(type);
    }

    async load(path: string) {
        const source = await loadText(path);
        this.gl.shaderSource(this.raw, source);
        this.gl.compileShader(this.raw);
        const success = this.gl.getShaderParameter(this.raw, this.gl.COMPILE_STATUS);
        if (success) {
            return true;
        }
   
        console.log(this.gl.getShaderInfoLog(this.raw));
        this.gl.deleteShader(this.raw);
        return false;
    }

    get() {
        return this.raw;
    }
}

export default Shader;