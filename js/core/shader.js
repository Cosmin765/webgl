var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { loadText } from "./utils.js";
class Shader {
    constructor(gl, type) {
        this.gl = gl;
        this.raw = gl.createShader(type);
    }
    load(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = yield loadText(path);
            this.gl.shaderSource(this.raw, source);
            this.gl.compileShader(this.raw);
            const success = this.gl.getShaderParameter(this.raw, this.gl.COMPILE_STATUS);
            if (success) {
                return true;
            }
            console.log(this.gl.getShaderInfoLog(this.raw));
            this.gl.deleteShader(this.raw);
            return false;
        });
    }
    get() {
        return this.raw;
    }
}
export default Shader;
//# sourceMappingURL=shader.js.map