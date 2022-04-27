var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UniformType } from "./types.js";
import * as mgl from "./../dependencies/Math_GL/index.js";
const $ = (name) => document.querySelector(name);
const loadText = (filePath) => __awaiter(void 0, void 0, void 0, function* () { return yield (yield fetch(filePath)).text(); });
const loadImage = (filePath) => new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = filePath;
});
const random = (min = 0, max = 1) => Math.random() * (max - min) + min;
const map = (x, a, b, c, d) => (x - a) / (b - a) * (d - c) + c;
const sin = (x) => Math.sin(x);
const cos = (x) => Math.cos(x);
const mapData = (type, data) => {
    switch (type) {
        case WebGL2RenderingContext.FLOAT:
            return new Float32Array(data);
        case WebGL2RenderingContext.UNSIGNED_BYTE:
            return new Uint8Array(data);
        case WebGL2RenderingContext.UNSIGNED_INT:
            return new Uint32Array(data);
        default:
            throw "Type not implemented! (mapData)";
    }
};
const getUniformSupplyHandler = (gl, type) => {
    switch (type) {
        case UniformType.INT:
            return gl.uniform1i.bind(gl);
        case UniformType.FLOAT:
            return gl.uniform1fv.bind(gl);
        case UniformType.VEC2:
            return gl.uniform2fv.bind(gl);
        case UniformType.VEC3:
            return gl.uniform3fv.bind(gl);
        case UniformType.VEC4:
            return gl.uniform4fv.bind(gl);
        case UniformType.MAT2:
            return gl.uniformMatrix2fv.bind(gl);
        case UniformType.MAT3:
            return gl.uniformMatrix3fv.bind(gl);
        case UniformType.MAT4:
            return gl.uniformMatrix4fv.bind(gl);
        default:
            throw "Type not supported! (getUniformSupplyHandler)";
    }
};
const printMat4 = (mat4, precision = 2) => {
    let buffer = "";
    for (let i = 0; i < 4; ++i) {
        for (let j = 0; j < 4; ++j) {
            buffer += mat4[i * 4 + j].toFixed(precision) + ' ';
        }
        buffer += '\n';
    }
    console.log(buffer);
};
const uuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};
const loadObj = (path) => __awaiter(void 0, void 0, void 0, function* () {
    const source = yield loadText(path);
    const lines = source.split("\n");
    const vertices = [];
    const texCoords = [];
    const normals = [];
    const faces = [];
    const handlers = {
        v(components) {
            vertices.push(components.map(Number));
        },
        f(components) {
            const face = [];
            for (const component of components) {
                const componentData = component.split("/").map(Number);
                face.push({
                    vertex: componentData[0],
                    texCoord: componentData[1],
                    normal: componentData[2]
                });
            }
            faces.push(face);
        },
        vt(components) {
            texCoords.push(components.map(Number));
        },
        vn(components) {
            normals.push(components.map(Number));
        }
    };
    for (let i = 0; i < lines.length; ++i) {
        const line = lines[i].trim();
        if (line.startsWith("#") || line.length === 0) {
            continue;
        }
        const tokens = line.split(" ");
        const command = tokens.splice(0, 1)[0];
        if (command in handlers) {
            handlers[command](tokens);
        }
    }
    const positionData = [];
    const normalData = [];
    const indexData = [];
    const normalsPresent = normals.length > 0;
    for (const face of faces) {
        let order;
        switch (face.length) {
            case 3:
                order = [0, 1, 2];
                break;
            case 4:
                order = [0, 1, 2, 2, 3, 0];
                break;
            default: continue;
        }
        const points = [];
        const offset = positionData.length / 3;
        for (let i = 0; i < face.length; ++i) {
            const point = vertices[face[i].vertex - 1];
            positionData.push(...point);
            if (normalsPresent) {
                normalData.push(...normals[face[i].normal - 1]);
            }
            else {
                points.push(point);
            }
        }
        if (!normalsPresent) {
            // calculate them
            const a = new mgl.Vector3(points[1]).sub(points[0]);
            const b = new mgl.Vector3(points[2]).sub(points[1]);
            const normal = a.cross(b);
            for (let i = 0; i < face.length; ++i) {
                normalData.push(...normal);
            }
        }
        for (const index of order) {
            indexData.push(offset + index);
        }
    }
    const drawData = {
        positionData: new Float32Array(positionData),
        normalData: new Float32Array(normalData),
        indexData: new Uint32Array(indexData),
    };
    const colorData = [];
    const color = [255, 105, 180, 255]; // pink
    for (let i = 0; i < drawData.positionData.length / 3; ++i) {
        colorData.push(...color);
    }
    drawData.colorData = new Uint8Array(colorData);
    return drawData;
});
const keys = new Map();
const checkKey = (key, handler) => {
    if (keys.get(key)) {
        handler();
    }
};
const hsvToRgb = (h, s, v) => {
    let r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0:
            r = v, g = t, b = p;
            break;
        case 1:
            r = q, g = v, b = p;
            break;
        case 2:
            r = p, g = v, b = t;
            break;
        case 3:
            r = p, g = q, b = v;
            break;
        case 4:
            r = t, g = p, b = v;
            break;
        case 5:
            r = v, g = p, b = q;
            break;
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), 255];
};
const degToRad = (deg) => (deg * Math.PI) / 180;
const radToDeg = (rad) => (rad * 180) / Math.PI;
addEventListener("keydown", e => keys.set(e.key, true));
addEventListener("keyup", e => keys.set(e.key, false));
export { $, loadText, loadImage, random, map, sin, cos, mapData, getUniformSupplyHandler, printMat4, uuid, checkKey, loadObj, hsvToRgb, degToRad, radToDeg, };
//# sourceMappingURL=utils.js.map