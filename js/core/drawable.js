import { UniformType } from "./types.js";
import Renderer from "./renderer.js";
import { mapData, getUniformSupplyHandler, uuid } from "./utils.js";
import * as mgl from "./../dependencies/Math_GL/index.js";
class Drawable {
    constructor(drawData) {
        this.buffers = new Map();
        this.uniforms = new Map();
        this.visible = true;
        this.children = new Map();
        this.translation = new mgl.Vector3();
        this.rotation = new mgl.Vector3();
        this.scaling = new mgl.Vector3(1, 1, 1);
        if (!drawData) {
            return;
        }
        this.vao = Renderer.gl.createVertexArray();
        Renderer.gl.bindVertexArray(this.vao);
        this.drawData = drawData;
        for (const name of Renderer.attribInfo.keys()) {
            this.buffers.set(name, Renderer.gl.createBuffer());
        }
        this.buffers.set("index", Renderer.gl.createBuffer());
        this.supplyAttrib("position", drawData.positionData);
        this.supplyAttrib("color", drawData.colorData);
        this.supplyAttrib("normal", drawData.normalData);
        this.supplyAttrib("texCoord", drawData.texCoord);
        this.supplyIndices(drawData.indexData);
        this.supplyUniform("isSprite", false);
    }
    setUniforms() {
        for (const [name, data] of this.uniforms) {
            const info = Renderer.uniformInfo.get(name);
            const uniformSupplyHandler = getUniformSupplyHandler(Renderer.gl, info.type);
            const uniformLoc = Renderer.uniformLoc(name);
            if (info.type >= UniformType.MAT2 && info.type <= UniformType.MAT4) {
                uniformSupplyHandler(uniformLoc, info.transpose, data);
            }
            else {
                uniformSupplyHandler(uniformLoc, data);
            }
        }
    }
    supplyAttrib(name, rawData) {
        if (!rawData) {
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
    supplyIndices(rawData) {
        const indexBuf = this.buffers.get("index");
        const data = mapData(Renderer.gl.UNSIGNED_INT, rawData);
        Renderer.gl.bindBuffer(Renderer.gl.ELEMENT_ARRAY_BUFFER, indexBuf);
        Renderer.gl.bufferData(Renderer.gl.ELEMENT_ARRAY_BUFFER, data, Renderer.gl.STATIC_DRAW);
    }
    supplyUniform(name, data) {
        this.uniforms.set(name, data);
    }
    addChild(child, name) {
        if (!name) {
            name = uuid();
        }
        this.children.set(name, child);
        return name;
    }
    addChildren(children) {
        for (const child of children) {
            this.addChild(child);
        }
    }
    removeChild(child) {
        if (typeof child === "string") {
            this.children.delete(child);
            return;
        }
        if (child instanceof Drawable) {
            for (const [name, drawable] of this.children) {
                if (child === drawable) {
                    this.children.delete(name);
                    return;
                }
            }
        }
    }
    translate(offset) {
        this.translation.add(offset);
        return this;
    }
    rotate(offset) {
        this.rotation.add([...offset]);
        return this;
    }
    scale(offset) {
        if (typeof offset === "number") {
            this.scaling.multiplyByScalar(offset);
        }
        else {
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
        for (const drawable of this.children.values()) {
            if (!drawable.visible) {
                continue;
            }
            drawable.render(worldTransform);
        }
    }
    renderCustom() {
        if (!this.drawData) {
            return;
        }
        Renderer.gl.enable(Renderer.gl.DEPTH_TEST);
        Renderer.gl.bindVertexArray(this.vao);
        Renderer.gl.drawElements(Renderer.gl.TRIANGLES, this.drawData.indexData.length, Renderer.gl.UNSIGNED_INT, 0);
    }
}
export default Drawable;
//# sourceMappingURL=drawable.js.map