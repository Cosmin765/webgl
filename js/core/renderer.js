var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { $, checkKey } from "./utils.js";
import Program from "./program.js";
import Drawable from "./drawable.js";
import * as mgl from "./../dependencies/Math_GL/index.js";
class Renderer {
    static init() {
        return __awaiter(this, void 0, void 0, function* () {
            const canvas = document.createElement("canvas");
            $("body").appendChild(canvas);
            this.gl = canvas.getContext("webgl2");
            if (!this.gl) {
                alert("Your browser doesn't support WebGL2!");
                return;
            }
            this.gl.canvas.width = innerWidth;
            this.gl.canvas.height = innerHeight;
            this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
            this.gl.enable(this.gl.CULL_FACE);
            this.gl.enable(this.gl.BLEND);
            this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
            this.program = new Program(this.gl);
            yield this.program.load(Renderer.VERTEX_SHADER_PATH, Renderer.FRAGMENT_SHADER_PATH);
            this.gl.useProgram(this.program.get());
        });
    }
    static uniformLoc(name) {
        if (!this.uniformLocations.has(name)) {
            const location = this.gl.getUniformLocation(this.program.get(), "u_" + name);
            this.uniformLocations.set(name, location);
        }
        return this.uniformLocations.get(name);
    }
    static attribLoc(name) {
        if (!this.attribLocations.has(name)) {
            const location = this.gl.getAttribLocation(this.program.get(), "a_" + name);
            this.attribLocations.set(name, location);
        }
        return this.attribLocations.get(name);
    }
    static initAttribInfo(attribInfoArr) {
        this.attribInfo.clear();
        for (const info of attribInfoArr) {
            this.attribInfo.set(info.name, info);
        }
    }
    static initUniformInfo(uniformInfoArr) {
        this.uniformInfo.clear();
        for (const info of uniformInfoArr) {
            this.uniformInfo.set(info.name, info);
        }
    }
    static initDataInfo(dataInfo) {
        this.initAttribInfo(dataInfo.attribInfo);
        this.initUniformInfo(dataInfo.uniformInfo);
    }
    static addInputHandler(key, callback) {
        this.inputHandlers.set(key, callback);
    }
    static removeInputHandler(key) {
        this.inputHandlers.delete(key);
    }
    static setInputHandlers(pairs) {
        this.inputHandlers.clear();
        for (const [key, callback] of pairs) {
            this.addInputHandler(key, callback);
        }
    }
    static checkInput(delta) {
        for (const [key, callback] of this.inputHandlers) {
            checkKey(key, () => callback(delta));
        }
    }
    static loop(update) {
        let last = 0;
        const eye = new mgl.Vector3(0, 0, 20);
        const target = new mgl.Vector3(eye).sub([0, 0, 1]);
        const viewMatrix = new mgl.Matrix4().lookAt(eye, target, [0, 1, 0]);
        const innerLoop = (now = performance.now()) => {
            const delta = (now - last) / 1000;
            this.frameRate = 1 / delta;
            this.checkInput(delta);
            update(delta);
            [this.gl.canvas.width, this.gl.canvas.height] = [innerWidth, innerHeight];
            this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
            this.gl.clearColor(0, 0, 0.2, 1);
            this.gl.clearDepth(1.0);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            const projectionMatrix = new mgl.Matrix4().perspective({
                fov: Math.PI / 4,
                aspect: this.gl.canvas.width / this.gl.canvas.height,
                near: 1,
                far: 10000,
            });
            this.scene.supplyUniform("projectionMatrix", projectionMatrix);
            this.scene.supplyUniform("lightDirReversed", new mgl.Vector3(0, 0, 1));
            this.scene.supplyUniform("viewMatrix", viewMatrix);
            this.scene.render();
            this.UI.render();
            last = now;
            requestAnimationFrame(innerLoop);
        };
        requestAnimationFrame(innerLoop);
        const amount = $(".amount");
        setInterval(() => amount.innerText = this.frameRate.toFixed(0), 100);
    }
}
Renderer.VERTEX_SHADER_PATH = "./../shaders/vertex.glsl";
Renderer.FRAGMENT_SHADER_PATH = "./../shaders/fragment.glsl";
Renderer.uniformLocations = new Map();
Renderer.attribLocations = new Map();
Renderer.inputHandlers = new Map();
Renderer.attribInfo = new Map();
Renderer.uniformInfo = new Map();
Renderer.frameRate = 0;
Renderer.scene = new Drawable();
Renderer.UI = new Drawable();
export default Renderer;
//# sourceMappingURL=renderer.js.map