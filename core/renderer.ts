import { $ } from "./utils.js";
import Program from "./program.js";
import { AttribInfo, DataInfo, UniformInfo } from "./types.js";
import Drawable from "./drawable.js";
import * as mgl from "./../dependencies/Math_GL/index.js";
import Camera from "./camera.js";
import Input from "./input.js";

class Renderer {
    private static VERTEX_SHADER_PATH = "./../shaders/vertex.glsl";
    private static FRAGMENT_SHADER_PATH = "./../shaders/fragment.glsl";
    private static program: Program;
    private static uniformLocations = new Map<string, WebGLUniformLocation>();
    private static attribLocations = new Map<string, number>();

    static canvas: HTMLCanvasElement;
    static gl: WebGL2RenderingContext;
    static attribInfo = new Map<string, AttribInfo>();
    static uniformInfo = new Map<string, UniformInfo>();
    static frameRate: number = 0;
    static scene = new Drawable();
    static UI = new Drawable();
    static camera = new Camera();
    
    static async init() {
        const canvas = document.createElement("canvas");
        $("body").appendChild(canvas);
        this.canvas = canvas;
        this.gl = canvas.getContext("webgl2");

        if(!this.gl) {
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
        await this.program.load(Renderer.VERTEX_SHADER_PATH, Renderer.FRAGMENT_SHADER_PATH);
        
        this.gl.useProgram(this.program.get());
    }

    static uniformLoc(name: string) {
        if(!this.uniformLocations.has(name)) {
            const location = this.gl.getUniformLocation(this.program.get(), "u_" + name);
            this.uniformLocations.set(name, location);
        }
        return this.uniformLocations.get(name);
    }

    static attribLoc(name: string) {
        if(!this.attribLocations.has(name)) {
            const location = this.gl.getAttribLocation(this.program.get(), "a_" + name);
            this.attribLocations.set(name, location);
        }
        return this.attribLocations.get(name);
    }

    private static initAttribInfo(attribInfoArr: AttribInfo[]) {
        this.attribInfo.clear();
        for(const info of attribInfoArr) {
            this.attribInfo.set(info.name, info);
        }
    }

    private static initUniformInfo(uniformInfoArr: UniformInfo[]) {
        this.uniformInfo.clear();
        for(const info of uniformInfoArr) {
            this.uniformInfo.set(info.name, info);
        }
    }

    static initDataInfo(dataInfo: DataInfo) {
        this.initAttribInfo(dataInfo.attribInfo);
        this.initUniformInfo(dataInfo.uniformInfo);
    }

    static loop(update: (delta?: number) => void) {
        let last = 0;
        
        const innerLoop = (now = performance.now()) => {
            const delta = (now - last) / 1000;
            this.frameRate = 1 / delta;
            Input.check(delta);
            
            update(delta);

            this.gl.canvas.width = innerWidth;
            this.gl.canvas.height = innerHeight;
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

            const lightDirReversed = new mgl.Vector3(0, 0, -1)
                .transformByQuaternion(this.camera.rotation)
                .scale(-1);

            this.scene.supplyUniform("lightDirReversed", lightDirReversed);
            this.scene.supplyUniform("viewMatrix", this.camera.viewMatrix);

            this.scene.render();
            this.UI.render();

            last = now;
            requestAnimationFrame(innerLoop);
        };
        requestAnimationFrame(innerLoop);
    
        setInterval(() => ($(".framerate > .amount") as HTMLElement).innerText = this.frameRate.toFixed(0), 100);
    }
}

export default Renderer;
