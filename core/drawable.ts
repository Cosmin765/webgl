import { DrawData, UniformType } from "./types.js";
import Renderer from "./renderer.js";
import { mapData, getUniformSupplyHandler, printMat4, uuid } from "./utils.js";
import * as mgl from "./../dependencies/Math_GL/index.js";

interface UniformState {
    data: Float32Array,
    changed?: boolean,
}

class Drawable {
    private vao: WebGLVertexArrayObject;
    private buffers = new Map<string, WebGLBuffer>();
    private uniforms = new Map<string, UniformState>();
    private visible = true;
    
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

        this.supplyAttrib("position", drawData.positionData);
        this.supplyAttrib("color", drawData.colorData);
        this.supplyAttrib("normal", drawData.normalData);
        this.supplyIndices(drawData.indexData);
    }

    private setUniforms() {
        for(const [ name, state ] of this.uniforms) {
            if(!state.changed) {
                continue;
            }
            const info = Renderer.uniformInfo.get(name);
            const uniformSupplyHandler = getUniformSupplyHandler(Renderer.gl, info.type);
            const uniformLoc = Renderer.uniformLoc(name);
            if(info.type >= UniformType.MAT2 && info.type <= UniformType.MAT4) {
                uniformSupplyHandler(uniformLoc, info.transpose, state.data);
            } else {
                uniformSupplyHandler(uniformLoc, state.data);
            }
            state.changed = false;
        }
    }
    
    supplyAttrib(name: string, rawData: Iterable<number>) {
        const buffer = this.buffers.get(name);
        const info = Renderer.attribInfo.get(name);
        const data = mapData(info.type, rawData);
        
        Renderer.gl.bindVertexArray(this.vao);
        Renderer.gl.bindBuffer(Renderer.gl.ARRAY_BUFFER, buffer);
        Renderer.gl.bufferData(Renderer.gl.ARRAY_BUFFER, data, Renderer.gl.STATIC_DRAW);
        Renderer.gl.enableVertexAttribArray(Renderer.attribLoc(name));
        Renderer.gl.vertexAttribPointer(Renderer.attribLoc(name), info.size, info.type, info.normalized, info.stride, info.offset);
    }
    
    supplyIndices(rawData: Iterable<number>) {
        const indexBuf = this.buffers.get("index");
        const data = mapData(Renderer.gl.UNSIGNED_INT, rawData);
        Renderer.gl.bindBuffer(Renderer.gl.ELEMENT_ARRAY_BUFFER, indexBuf);
        Renderer.gl.bufferData(Renderer.gl.ELEMENT_ARRAY_BUFFER, data, Renderer.gl.STATIC_DRAW);
    }

    supplyUniform(name: string, rawData: Iterable<number>) {
        const uniformState: UniformState = {
            data: new Float32Array(rawData),
            changed: true,
        };
        this.uniforms.set(name, uniformState);
    }

    addChild(child: Drawable, name?: string) {
        if(!name) {
            name = uuid();
        }
        this.children.set(name, child);
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
        
        if(this.drawData) {
            Renderer.gl.bindVertexArray(this.vao);
            Renderer.gl.drawElements(Renderer.gl.TRIANGLES, this.drawData.indexData.length, Renderer.gl.UNSIGNED_INT, 0);
        }
        
        for(const drawable of this.children.values()) {
            if(!drawable.visible) {
                continue;
            }
            drawable.render(worldTransform);
        }
    }
}

export default Drawable;