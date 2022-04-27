import { UniformType, DrawData, FaceComponentData, FaceData } from "./types.js";
import * as mgl from "./../dependencies/Math_GL/index.js";

const $ = (name: string) => document.querySelector(name);
const loadText = async (filePath: string) => await (await fetch(filePath)).text();
const loadImage = (filePath: string): Promise<HTMLImageElement> => new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = filePath;
});
const random = (min = 0, max = 1) => Math.random() * (max - min) + min;
const map = (x: number, a: number, b: number, c: number, d: number) => (x - a) / (b - a) * (d - c) + c;
const sin = (x: number) => Math.sin(x);
const cos = (x: number) => Math.cos(x);
const mapData = (type: number, data: Iterable<number>) => {
    switch(type) {
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
const getUniformSupplyHandler = (gl: WebGL2RenderingContext, type: UniformType) : any => {
    switch(type) {
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
            throw "Type not supported! (getUniformSupplyHandler)"
    }
};
const printMat4 = (mat4: Iterable<number>, precision = 2) => {
    let buffer = "";
    for(let i = 0; i < 4; ++i) {
        for(let j = 0; j < 4; ++j) {
            buffer += mat4[i * 4 + j].toFixed(precision) + ' ';
        }
        buffer += '\n';
    }
    console.log(buffer);
};
const uuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
       var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
       return v.toString(16);
    });
};

const loadObj = async (path: string) => {
    const source = await loadText(path);
    const lines = source.split("\n");

    const vertices: Array<number[]> = [];
    const texCoords: Array<number[]> = [];
    const normals: Array<number[]> = [];
    const faces: FaceData[] = [];

    const handlers = {
        v(components: Array<string>) {
            vertices.push(components.map(Number));
        },
        f(components: Array<string>) {
            const face: FaceData = [];
            for(const component of components) {
                const componentData = component.split("/").map(Number);

                face.push({
                    vertex: componentData[0],
                    texCoord: componentData[1],
                    normal: componentData[2]
                });
            }
            faces.push(face);
        },
        vt(components: Array<string>) {
            texCoords.push(components.map(Number));
        },
        vn(components: Array<string>) {
            normals.push(components.map(Number));
        }
    };

    for(let i = 0; i < lines.length; ++i) {
        const line = lines[i].trim();

        if(line.startsWith("#") || line.length === 0) {
            continue;
        }

        const tokens = line.split(" ");

        const command = tokens.splice(0, 1)[0];
        if(command in handlers) {
            handlers[command](tokens);
        }
    }

    const positionData: Array<number> = [];
    const normalData: Array<number> = [];
    const indexData: Array<number> = [];

    const normalsPresent = normals.length > 0;
    
    for(const face of faces) {
        let order: number[];
        switch(face.length) {
            case 3: order = [ 0, 1, 2 ]; break;
            case 4: order = [ 0, 1, 2, 2, 3, 0 ]; break;
            default: continue;
        }
        const points: Array<number[]> = [];
        const offset = positionData.length / 3;
        for(let i = 0; i < face.length; ++i) {
            const point = vertices[face[i].vertex - 1];
            positionData.push(...point);
            if(normalsPresent) {
                normalData.push(...normals[face[i].normal - 1]);
            } else {
                points.push(point);
            }
        }
        if(!normalsPresent) {
            // calculate them
            const a = new mgl.Vector3(points[1]).sub(points[0]);
            const b = new mgl.Vector3(points[2]).sub(points[1]);
            const normal = a.cross(b);

            for(let i = 0; i < face.length; ++i) {
                normalData.push(...normal);
            }
        }
        for(const index of order) {
            indexData.push(offset + index);
        }
    }

    const drawData: DrawData = {
        positionData: new Float32Array(positionData),
        normalData: new Float32Array(normalData),
        indexData: new Uint32Array(indexData),
    };

    const colorData: Array<number> = [];
    const color = [ 255, 105, 180, 255 ]; // pink
    for(let i = 0; i < drawData.positionData.length / 3; ++i) {
        colorData.push(...color);
    }
    drawData.colorData = new Uint8Array(colorData);

    return drawData;
};

const keys = new Map<string, boolean>();
const checkKey = (key: string, handler: () => any) => {
    if(keys.get(key)) {
        handler();
    }
};

const hsvToRgb = (h: number, s: number, v: number) => {
    let r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return [ Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), 255 ];
};

const degToRad = (deg: number) => (deg * Math.PI) / 180;
const radToDeg = (rad: number) => (rad * 180) / Math.PI;

addEventListener("keydown", e => keys.set(e.key, true));
addEventListener("keyup", e => keys.set(e.key, false));

export {
    $,
    loadText,
    loadImage,
    random,
    map,
    sin,
    cos,
    mapData,
    getUniformSupplyHandler,
    printMat4,
    uuid,
    checkKey,
    loadObj,
    hsvToRgb,
    degToRad,
    radToDeg,
};