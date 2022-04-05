import Shader from "./shader.js";

class Program {
    private raw: WebGLProgram;
    private gl: WebGL2RenderingContext;

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
        this.raw = this.gl.createProgram();
    }

    async load(vertexPath: string, fragmentPath: string) {
        const vertexShader = new Shader(this.gl, this.gl.VERTEX_SHADER);
        const fragmentShader = new Shader(this.gl, this.gl.FRAGMENT_SHADER);

        await vertexShader.load(vertexPath);
        await fragmentShader.load(fragmentPath);

        this.gl.attachShader(this.raw, vertexShader.get());
        this.gl.attachShader(this.raw, fragmentShader.get());
        this.gl.linkProgram(this.raw);
        const success = this.gl.getProgramParameter(this.raw, this.gl.LINK_STATUS);
        if (success) {
            return true;
        }
    
        console.log(this.gl.getProgramInfoLog(this.raw));
        this.gl.deleteProgram(this.raw);
        return false;
    }

    get() {
        return this.raw;
    }
}

export default Program;