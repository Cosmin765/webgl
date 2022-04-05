var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Shader from "./shader.js";
class Program {
    constructor(gl) {
        this.gl = gl;
        this.raw = this.gl.createProgram();
    }
    load(vertexPath, fragmentPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const vertexShader = new Shader(this.gl, this.gl.VERTEX_SHADER);
            const fragmentShader = new Shader(this.gl, this.gl.FRAGMENT_SHADER);
            yield vertexShader.load(vertexPath);
            yield fragmentShader.load(fragmentPath);
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
        });
    }
    get() {
        return this.raw;
    }
}
export default Program;
//# sourceMappingURL=program.js.map