import Renderer from "../core/renderer.js";
import { UniformType } from "../core/types.js";
import Drawable from "../core/drawable.js";
import { loadObj, hsvToRgb, degToRad } from "../core/utils.js";
import Button from "../core/UI/button.js";
import * as mgl from "./../dependencies/Math_GL/index.js";

window.onload = main;

let drawable: Drawable = new Drawable();

async function main() {
    await setup();

    const drawData = await loadObj("../assets/obj/chair.obj");
    const colorData = drawData.colorData;
    drawData.colorData = new Uint8Array(Array(colorData.length));

    for (let i = 0; i < colorData.length; ++i) {
        if ((i + 1) % 4 === 0) {
            drawData.colorData[i] = 255;
            continue;
        }

        drawData.colorData[i] = (Math.random() * 255) | 0;
    }

    const chair = new Drawable(drawData);
    chair.supplyUniform("color", [ 1, 0, 1, 1 ]);
    chair.supplyUniform("useUniformColor", 0);
    Renderer.scene.addChild(chair);
    chair.translate([ 0, 0.5, 0 ]);
    
    const cup = new Drawable(await loadObj("../assets/obj/cup.obj"));
    cup.supplyUniform("color", [ 1, 1, 0, 1 ]);
    cup.supplyUniform("useUniformColor", 1);
    Renderer.scene.addChild(cup);

    Renderer.camera.translation = new mgl.Vector3(0, 0, 20);
    // Renderer.camera.target = new mgl.Vector3(0, 0, 0);

    drawable = cup;

    const button = new Button("../assets/button.png", () => console.log(this));
    // Renderer.UI.addChild(button);
    button.translate([ 2, -5, 0 ]);

    Renderer.scene.rotate([ 1, 0, 0 ]);

    Renderer.loop((delta: number) => {
        Renderer.scene.rotate([ 0, 1.5 * delta, 0 ]);
    });
}

async function setup() {
    await Renderer.init();

    Renderer.initDataInfo({
        attribInfo: [
            { name: "position", size: 3, type: WebGL2RenderingContext.FLOAT, normalized: false, stride: 0, offset: 0 },
            { name: "color", size: 4, type: WebGL2RenderingContext.UNSIGNED_BYTE, normalized: true, stride: 0, offset: 0 },
            { name: "normal", size: 3, type: WebGL2RenderingContext.FLOAT, normalized: false, stride: 0, offset: 0 },
            { name: "texCoord", size: 2, type: WebGL2RenderingContext.FLOAT, normalized: false, stride: 0, offset: 0 },
        ],
        uniformInfo: [
            { name: "isSprite", type: UniformType.INT },
            { name: "useUniformColor", type: UniformType.INT },
            { name: "projectionMatrix", type: UniformType.MAT4, transpose: false },
            { name: "lightDirReversed", type: UniformType.VEC3 },
            { name: "color", type: UniformType.VEC4 },
            { name: "viewMatrix", type: UniformType.MAT4, transpose: false },
            { name: "modelMatrix", type: UniformType.MAT4, transpose: false },
            { name: "modelMatrixLight", type: UniformType.MAT4, transpose: false },
        ]
    });

    let angle = 0;
    Renderer.setInputHandlers([
        [ "w", (delta: number) => Renderer.camera.translation[2] -= 10 * delta ],
        [ "a", (delta: number) => Renderer.camera.translation[0] -= 10 * delta ],
        [ "s", (delta: number) => Renderer.camera.translation[2] += 10 * delta ],
        [ "d", (delta: number) => Renderer.camera.translation[0] += 10 * delta ],

        [ "ArrowUp", (delta: number) => Renderer.camera.rotation[0] += 1 * delta ],
        [ "ArrowLeft", (delta: number) => Renderer.camera.rotation[1] += 1 * delta ],
        [ "ArrowDown", (delta: number) => Renderer.camera.rotation[0] -= 1 * delta ],
        [ "ArrowRight", (delta: number) => Renderer.camera.rotation[1] -= 1 * delta ],

        [ " ", () => {
            angle += 1;
            angle %= 360;

            const color = hsvToRgb(degToRad(angle), 1, 1).map(el => el / 255);
            console.log(color);
            drawable.supplyUniform("color", color);
        } ],
    ]);
}

export default main;
