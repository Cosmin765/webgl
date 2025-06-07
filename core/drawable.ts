import { DrawData, UniformType } from "./types.js";
import Renderer from "./renderer.js";
import { mapData, getUniformSupplyHandler, printMat4, uuid } from "./utils.js";
import * as mgl from "./../dependencies/Math_GL/index.js";

class Drawable {
    private buffers = new Map<string, WebGLBuffer>();
    private uniforms = new Map<string, any>();
    private visible = true;
    protected vao: WebGLVertexArrayObject;
    
    children = new Map<string, Drawable>();
    drawData: DrawData;
    translation = new mgl.Vector3();
    rotation = new mgl.Vector3();
    scaling = new mgl.Vector3(1, 1, 1);

    constructor(drawData?: DrawData) {
        if(!drawData) {
            return;
        }

        this.vao = Renderer.gl.createVertexArray();
        Renderer.gl.bindVertexArray(this.vao);
        this.drawData = drawData;
        for(const name of Renderer.attribInfo.keys()) {
            this.buffers.set(name, Renderer.gl.createBuffer());
        }
        this.buffers.set("index", Renderer.gl.createBuffer());

        this.init();
    }

    init() {
        this.supplyAttrib("position", this.drawData.positionData);
        this.supplyAttrib("color", this.drawData.colorData);
        this.supplyAttrib("normal", this.drawData.normalData);
        this.supplyAttrib("texCoord", this.drawData.texCoord);
        this.supplyIndices(this.drawData.indexData);

        this.supplyUniform("isSprite", false);
    }

    protected setUniforms() {
        for(const [ name, data ] of this.uniforms) {
            const info = Renderer.uniformInfo.get(name);
            const uniformSupplyHandler = getUniformSupplyHandler(Renderer.gl, info.type);
            const uniformLoc = Renderer.uniformLoc(name);

            if(info.type >= UniformType.MAT2 && info.type <= UniformType.MAT4) {
                uniformSupplyHandler(uniformLoc, info.transpose, data);
            } else {
                uniformSupplyHandler(uniformLoc, data);
            }
        }
    }
    
    private supplyAttrib(name: string, rawData?: Iterable<number>) {
        if(!rawData) {
            return;
        }

        const buffer = this.buffers.get(name);
        const info = Renderer.attribInfo.get(name);
        const data = mapData(info.type, rawData);
        
        Renderer.gl.bindVertexArray(this.vao);
        Renderer.gl.bindBuffer(Renderer.gl.ARRAY_BUFFER, buffer);
        Renderer.gl.bufferData(Renderer.gl.ARRAY_BUFFER, data, Renderer.gl.STATIC_DRAW);
        Renderer.gl.enableVertexAttribArray(Renderer.attribLoc(name));
        Renderer.gl.vertexAttribPointer(Renderer.attribLoc(name), info.size, info.type, info.normalized, info.stride, info.offset);
    }
    
    private supplyIndices(rawData: Iterable<number>) {
        const indexBuf = this.buffers.get("index");
        const data = mapData(Renderer.gl.UNSIGNED_INT, rawData);
        Renderer.gl.bindBuffer(Renderer.gl.ELEMENT_ARRAY_BUFFER, indexBuf);
        Renderer.gl.bufferData(Renderer.gl.ELEMENT_ARRAY_BUFFER, data, Renderer.gl.STATIC_DRAW);
    }

    supplyUniform(name: string, data: any) {
        this.uniforms.set(name, data);
    }

    addChild(child: Drawable, name?: string) {
        if(!name) {
            name = uuid();
        }
        this.children.set(name, child);
        return name;
    }

    addChildren(children: Iterable<Drawable>) {
        for(const child of children) {
            this.addChild(child);
        }
    }

    removeChild(child: string | Drawable) {
        if(typeof child === "string") {
            this.children.delete(child);
            return;
        }

        if(child instanceof Drawable) {
            for(const [ name, drawable ] of this.children) {
                if(child === drawable) {
                    this.children.delete(name);
                    return;
                }
            }
        }
    }

    translate(offset: Iterable<number>) {
        this.translation.add(offset);
        return this;
    }

    rotate(offset: Iterable<number>) {
        this.rotation.add([...offset]);
        return this;
    }

    scale(offset: Iterable<number> | number) {
        if(typeof offset === "number") {
            this.scaling.multiplyByScalar(offset);
        } else {
            this.scaling.multiply(offset);
        }
        return this;
    }

    render(parentTransform = new mgl.Matrix4()) {
        const localTransform = new mgl.Matrix4()
        .translate(this.translation)
        .rotateXYZ(this.rotation)
        .scale(this.scaling);

        const worldTransform = new mgl.Matrix4(parentTransform).multiplyRight(localTransform);
        
        this.supplyUniform("modelMatrix", worldTransform);
        this.supplyUniform("modelMatrixLight", new mgl.Matrix4(worldTransform).invert().transpose());
        this.setUniforms();
        
        this.renderCustom();
        
        for(const drawable of this.children.values()) {
            if(!drawable.visible) {
                continue;
            }
            drawable.render(worldTransform);
        }
    }

    protected renderCustom() {
        if(!this.drawData) {
            return;
        }

        Renderer.gl.enable(Renderer.gl.DEPTH_TEST);
        
        Renderer.gl.bindVertexArray(this.vao);
        Renderer.gl.drawElements(Renderer.gl.TRIANGLES, this.drawData.indexData.length, Renderer.gl.UNSIGNED_INT, 0);
    }
}

export default Drawable;